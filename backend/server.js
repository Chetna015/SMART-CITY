import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db, initDatabase } from './db.js';
import { analyzeCivicReport } from './ai_engine.js';
import crypto from 'node:crypto';
import { sendOtpSms } from './sms.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize database schema and seeds
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded media
app.use('/uploads', express.static(uploadsDir));

// Configure Multer for photo and audio storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || (file.mimetype.includes('audio') ? '.mp3' : '.jpg');
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Eco-Saathi Civic Engine', time: new Date().toISOString() });
});

// -----------------------------------------------------------------------------
// 1. AI PREVIEW / REAL-TIME ANALYSIS ENDPOINT
// -----------------------------------------------------------------------------
app.post('/api/ai/analyze', upload.single('image'), (req, res) => {
  try {
    const { description = '', landmark = '', area = '', audioTranscript = '' } = req.body;
    const imageFilename = req.file ? req.file.filename : (req.body.imageFilename || '');

    const analysis = analyzeCivicReport({
      imageFilename,
      description,
      audioTranscript,
      landmark,
      area
    });

    res.json({
      success: true,
      analysis
    });
  } catch (err) {
    console.error('AI Analysis Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 2. VOICE NOTE UPLOAD ENDPOINT (as called by ReportIssue.jsx)
// -----------------------------------------------------------------------------
app.post('/uploadVoice', upload.single('voiceNote'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No voice file received' });
    }

    const audioUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      audioUrl,
      filename: req.file.filename,
      message: 'Voice note uploaded and processed successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 3. REPORT ISSUE ENDPOINT (Called by ReportIssue.jsx)
// -----------------------------------------------------------------------------
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'voiceNote', maxCount: 1 }
]);

app.post('/report', uploadFields, (req, res) => {
  try {
    const {
      description = '',
      location = '',
      landmark = '',
      area = '',
      lat = null,
      lng = null,
      reporter_name = 'Citizen',
      reporter_phone = '9125900756',
      userUrgency = ''
    } = req.body;

    const imageFile = req.files && req.files['image'] ? req.files['image'][0] : null;
    const voiceFile = req.files && req.files['voiceNote'] ? req.files['voiceNote'][0] : null;

    const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : null;
    const audioUrl = voiceFile ? `/uploads/${voiceFile.filename}` : null;

    // Run AI Engine Analysis
    const aiResult = analyzeCivicReport({
      imageFilename: imageFile ? imageFile.originalname : '',
      description,
      landmark,
      area
    });

    const category = aiResult.category;
    // User can manually set urgency or accept AI priority
    const priority = userUrgency || aiResult.priority;
    const department_id = aiResult.routing.department_id;
    const department_name = aiResult.routing.department_name;

    // Generate unique tracking ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const tracking_id = `ECO-${randomNum}`;

    const parsedLat = lat ? parseFloat(lat) : 25.3176;
    const parsedLng = lng ? parseFloat(lng) : 82.9739;

    const title = description.length > 50 ? description.substring(0, 47) + '...' : (description || `Reported ${category} issue near ${area || landmark || 'city'}`);

    const stmt = db.prepare(`
      INSERT INTO issues (
        tracking_id, title, description, category, priority, status,
        lat, lng, area, landmark, location_address, image_url, audio_url,
        ai_confidence, ai_tags, ai_analysis, reporter_name, reporter_phone,
        department_id, department_name, created_at
      ) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
    `);

    const info = stmt.run(
      tracking_id,
      title,
      description,
      category,
      priority,
      parsedLat,
      parsedLng,
      area || 'Local Ward',
      landmark || 'Near Location',
      location || `${area}, ${landmark}`,
      imageUrl,
      audioUrl,
      aiResult.confidence,
      JSON.stringify(aiResult.tags),
      aiResult.aiAnalysis,
      reporter_name,
      reporter_phone,
      department_id,
      department_name
    );

    const issueId = Number(info.lastInsertRowid);

    // Create Activity Log
    db.prepare(`
      INSERT INTO activity_logs (issue_id, action, actor, notes)
      VALUES (?, 'Issue Reported & Auto-Routed', 'Eco-Saathi AI Engine', ?)
    `).run(issueId, aiResult.routing.routing_rule);

    // Create Notification for Citizen
    db.prepare(`
      INSERT INTO notifications (user_phone, role, issue_id, title, message, type)
      VALUES (?, 'citizen', ?, 'Issue Reported Successfully', ?, 'info')
    `).run(
      reporter_phone,
      issueId,
      `Your report ${tracking_id} has been submitted and auto-routed to ${department_name}. Estimated SLA: ${aiResult.routing.sla_hours}h.`
    );

    // Create Notification for Department Admin
    db.prepare(`
      INSERT INTO notifications (user_phone, role, issue_id, title, message, type)
      VALUES (?, 'dept_admin', ?, 'New Civic Issue Assigned', ?, 'urgent')
    `).run(
      department_id.toString(),
      issueId,
      `New ${priority} priority ${category} issue (${tracking_id}) assigned to your department at ${area || landmark}.`
    );

    res.status(201).json({
      success: true,
      message: 'Issue reported and auto-routed successfully!',
      issue: {
        id: issueId,
        tracking_id,
        title,
        category,
        priority,
        department_name,
        ai_confidence: aiResult.confidence,
        sla_hours: aiResult.routing.sla_hours
      }
    });
  } catch (err) {
    console.error('Error reporting issue:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Also support JSON /api/issues endpoint
app.post('/api/issues', (req, res) => {
  // Redirect to handler or process JSON
  req.url = '/report';
  app.handle(req, res);
});

// -----------------------------------------------------------------------------
// 4. GET ALL ISSUES WITH FILTERS
// -----------------------------------------------------------------------------
app.get('/api/issues', (req, res) => {
  try {
    const { department_id, status, priority, category, search, phone } = req.query;

    let query = 'SELECT * FROM issues WHERE 1=1';
    const params = [];

    if (department_id) {
      query += ' AND department_id = ?';
      params.push(Number(department_id));
    }
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status.toLowerCase());
    }
    if (priority && priority !== 'all') {
      query += ' AND priority = ?';
      params.push(priority);
    }
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category.toLowerCase());
    }
    if (phone) {
      query += ' AND reporter_phone = ?';
      params.push(phone);
    }
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR tracking_id LIKE ? OR area LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY id DESC';

    const issues = db.prepare(query).all(...params);
    res.json({ success: true, count: issues.length, issues });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 5. GET SINGLE ISSUE DETAILS & TIMELINE
// -----------------------------------------------------------------------------
app.get('/api/issues/:id', (req, res) => {
  try {
    const issue = db.prepare('SELECT * FROM issues WHERE id = ? OR tracking_id = ?').get(req.params.id, req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const timeline = db.prepare('SELECT * FROM activity_logs WHERE issue_id = ? ORDER BY id ASC').all(issue.id);

    res.json({ success: true, issue, timeline });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 6. UPDATE ISSUE STATUS (Accept, In-Progress, Resolve, Reject)
// -----------------------------------------------------------------------------
app.patch('/api/issues/:id/status', (req, res) => {
  try {
    const issueId = Number(req.params.id);
    const { status, assigned_staff, rejection_reason, resolution_remarks, actor = 'Department Staff' } = req.body;

    const existing = db.prepare('SELECT * FROM issues WHERE id = ?').get(issueId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    let updateQuery = 'UPDATE issues SET status = ?, updated_at = datetime(\'now\', \'localtime\')';
    const params = [status.toLowerCase()];

    if (assigned_staff) {
      updateQuery += ', assigned_staff = ?';
      params.push(assigned_staff);
    }
    if (rejection_reason) {
      updateQuery += ', rejection_reason = ?';
      params.push(rejection_reason);
    }
    if (resolution_remarks) {
      updateQuery += ', resolution_remarks = ?';
      params.push(resolution_remarks);
    }

    updateQuery += ' WHERE id = ?';
    params.push(issueId);

    db.prepare(updateQuery).run(...params);

    // Record activity log
    let notes = `Status updated to ${status}.`;
    if (status === 'accepted') notes = `Accepted by department. Assigned to: ${assigned_staff || 'Field Crew'}.`;
    if (status === 'rejected') notes = `Rejected. Reason: ${rejection_reason}`;
    if (status === 'resolved') notes = `Resolved. Remarks: ${resolution_remarks || 'Inspection and corrective action completed.'}`;

    db.prepare(`
      INSERT INTO activity_logs (issue_id, action, actor, notes)
      VALUES (?, ?, ?, ?)
    `).run(issueId, `Status: ${status.toUpperCase()}`, actor, notes);

    // Notify citizen
    db.prepare(`
      INSERT INTO notifications (user_phone, role, issue_id, title, message, type)
      VALUES (?, 'citizen', ?, ?, ?, ?)
    `).run(
      existing.reporter_phone,
      issueId,
      `Issue ${existing.tracking_id} Status: ${status.toUpperCase()}`,
      `Your report "${existing.title}" is now marked as ${status}. ${notes}`,
      status === 'resolved' ? 'status_change' : 'info'
    );

    const updated = db.prepare('SELECT * FROM issues WHERE id = ?').get(issueId);
    res.json({ success: true, message: `Issue status updated to ${status}`, issue: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 7. ANALYTICS & INSIGHTS (Super Admin Global Overview)
// -----------------------------------------------------------------------------
app.get('/api/analytics/overview', (req, res) => {
  try {
    const total = db.prepare('SELECT count(*) as count FROM issues').get().count;
    const pending = db.prepare("SELECT count(*) as count FROM issues WHERE status = 'pending'").get().count;
    const inProgress = db.prepare("SELECT count(*) as count FROM issues WHERE status IN ('in-progress', 'accepted')").get().count;
    const resolved = db.prepare("SELECT count(*) as count FROM issues WHERE status = 'resolved'").get().count;
    const rejected = db.prepare("SELECT count(*) as count FROM issues WHERE status = 'rejected'").get().count;

    const resolutionRate = total > 0 ? `${Math.round((resolved / total) * 100)}%` : '0%';

    // Category distribution for pie chart
    const categoryRows = db.prepare(`
      SELECT category, count(*) as count FROM issues GROUP BY category
    `).all();

    const categoryNames = {
      garbage: 'Garbage & Waste',
      pothole: 'Pothole & Roads',
      streetlight: 'Street Lights',
      water_leak: 'Water Works',
      sewage: 'Sewage & Drain',
      traffic_signal: 'Traffic Signals',
      tree: 'Trees & Parks'
    };

    const pieData = categoryRows.map(r => ({
      name: categoryNames[r.category] || r.category,
      value: r.count
    }));

    // Monthly data for bar chart
    const monthlyData = [
      { month: 'Jan', issues: 40 },
      { month: 'Feb', issues: 55 },
      { month: 'Mar', issues: 30 },
      { month: 'Apr', issues: 70 },
      { month: 'May', issues: 65 },
      { month: 'Jun', issues: total }
    ];

    // Priority breakdown
    const priorityBreakdown = db.prepare(`
      SELECT priority, count(*) as count FROM issues GROUP BY priority
    `).all();

    res.json({
      success: true,
      stats: [
        { label: 'Total Issues', value: total },
        { label: 'Pending Issues', value: pending },
        { label: 'In-Progress', value: inProgress },
        { label: 'Resolved Issues', value: resolved },
        { label: 'Resolution Rate', value: resolutionRate }
      ],
      pieData,
      monthlyData,
      priorityBreakdown
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 8. DEPARTMENTS CRUD & STATS
// -----------------------------------------------------------------------------
app.get('/api/departments', (req, res) => {
  try {
    const departments = db.prepare('SELECT * FROM departments WHERE active = 1').all();

    // Attach live issue counts to each department
    const deptsWithStats = departments.map(d => {
      const issues = db.prepare(`
        SELECT 
          count(*) as total,
          sum(case when status = 'pending' then 1 else 0 end) as pending,
          sum(case when status = 'resolved' then 1 else 0 end) as resolved
        FROM issues WHERE department_id = ?
      `).get(d.id);

      return {
        ...d,
        totalIssues: issues.total || 0,
        pendingIssues: issues.pending || 0,
        resolvedIssues: issues.resolved || 0
      };
    });

    res.json({ success: true, departments: deptsWithStats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/departments', (req, res) => {
  try {
    const { name, category_key, head, phone, email, zone, sla_hours = 24 } = req.body;
    const stmt = db.prepare(`
      INSERT INTO departments (name, category_key, head, phone, email, zone, sla_hours)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, category_key || 'general', head, phone, email, zone, sla_hours);
    res.status(201).json({ success: true, id: Number(result.lastInsertRowid), message: 'Department created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 9. ADMINS / STAFF MANAGEMENT
// -----------------------------------------------------------------------------
app.get('/api/admin/admins', (req, res) => {
  try {
    const admins = db.prepare(`
      SELECT u.id, u.name, u.email, u.phone, u.role, d.name as department, d.id as department_id
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.role IN ('dept_admin', 'superadmin')
    `).all();
    res.json({ success: true, admins });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin/create-admin', (req, res) => {
  try {
    const { name, email, phone, password = 'password123', department_id, department } = req.body;

    let deptId = department_id;
    if (!deptId && department) {
      const foundDept = db.prepare('SELECT id FROM departments WHERE name LIKE ?').get(`%${department}%`);
      if (foundDept) deptId = foundDept.id;
    }

    const stmt = db.prepare(`
      INSERT INTO users (name, email, phone, role, department_id, password)
      VALUES (?, ?, ?, 'dept_admin', ?, ?)
    `);
    const info = stmt.run(name, email, phone, deptId || 1, password);

    res.status(201).json({
      success: true,
      message: 'Department admin created successfully',
      admin: { id: Number(info.lastInsertRowid), name, email, phone, department_id: deptId }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 
// -----------------------------------------------------------------------------
// OTP AUTH
// -----------------------------------------------------------------------------
const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;
const profileTokens = new Map(); // short-lived token for first-time name entry

const hashOtp = (phone, otp) =>
  crypto.createHash('sha256')
    .update(`${phone}:${otp}:${process.env.OTP_SECRET || 'dev-secret'}`)
    .digest('hex');

app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const phone = String(req.body.phone || '').replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit mobile number.' });
    }

    const last = db.prepare('SELECT created_at_ms FROM otps WHERE phone = ? ORDER BY id DESC LIMIT 1').get(phone);
    if (last && Date.now() - last.created_at_ms < RESEND_MS) {
      return res.status(429).json({ success: false, message: 'Please wait 30 seconds before requesting another OTP.' });
    }

    const otp = String(crypto.randomInt(100000, 1000000));
    db.prepare('DELETE FROM otps WHERE phone = ?').run(phone);
    db.prepare('INSERT INTO otps (phone, otp_hash, expires_at_ms, created_at_ms) VALUES (?, ?, ?, ?)')
      .run(phone, hashOtp(phone, otp), Date.now() + OTP_TTL_MS, Date.now());

    try {
      await sendOtpSms(phone, otp);
    } catch (smsErr) {
      db.prepare('DELETE FROM otps WHERE phone = ?').run(phone);
      console.error('SMS send failed:', smsErr.message);
      return res.status(502).json({ success: false, message: 'Could not send SMS. Try again.' });
    }

    const devMode = !process.env.SMS_PROVIDER;
    res.json({ success: true, message: 'OTP sent', ...(devMode && { devOtp: otp }) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/verify-otp', (req, res) => {
  try {
    const phone = String(req.body.phone || '').replace(/\D/g, '');
    const otp = String(req.body.otp || '').trim();

    const row = db.prepare('SELECT * FROM otps WHERE phone = ? ORDER BY id DESC LIMIT 1').get(phone);
    if (!row || Date.now() > row.expires_at_ms) {
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
    }
    if (row.attempts >= MAX_ATTEMPTS) {
      return res.status(429).json({ success: false, message: 'Too many wrong attempts. Request a new OTP.' });
    }
    if (hashOtp(phone, otp) !== row.otp_hash) {
      db.prepare('UPDATE otps SET attempts = attempts + 1 WHERE id = ?').run(row.id);
      return res.status(401).json({ success: false, message: 'Incorrect OTP.' });
    }

    db.prepare('DELETE FROM otps WHERE phone = ?').run(phone);

    const user = db.prepare("SELECT id, name, phone, role FROM users WHERE phone = ? AND role = 'citizen'").get(phone);
    if (user) return res.json({ success: true, needsName: false, user });

    const token = crypto.randomBytes(16).toString('hex');
    profileTokens.set(token, { phone, exp: Date.now() + 10 * 60 * 1000 });
    res.json({ success: true, needsName: true, profileToken: token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/complete-profile', (req, res) => {
  try {
    const { profileToken, name } = req.body;
    const entry = profileTokens.get(profileToken);
    if (!entry || Date.now() > entry.exp || !String(name || '').trim()) {
      return res.status(400).json({ success: false, message: 'Session expired. Please log in again.' });
    }
    profileTokens.delete(profileToken);
    const clean = String(name).trim();
    const info = db.prepare("INSERT INTO users (name, phone, role) VALUES (?, ?, 'citizen')").run(clean, entry.phone);
    res.json({ success: true, user: { id: Number(info.lastInsertRowid), name: clean, phone: entry.phone, role: 'citizen' } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 10. AUTHENTICATION & LOGIN
// -----------------------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, username, phone, password, role } = req.body;

    if (role === 'superadmin' || email === 'admin@eco.com') {
      const user = db.prepare("SELECT * FROM users WHERE role = 'superadmin'").get();
      if (password === '123456' || (user && user.password === password)) {
        return res.json({ success: true, user: { name: 'Super Admin', email: 'admin@eco.com', role: 'superadmin' } });
      }
      return res.status(401).json({ success: false, message: 'Invalid Super Admin credentials' });
    }

    if (role === 'dept_admin' || email === 'dept@eco.com' || username === 'dept@eco.com') {
      const user = db.prepare("SELECT u.*, d.name as department_name FROM users u LEFT JOIN departments d ON u.department_id = d.id WHERE u.email = ? OR u.role = 'dept_admin'").get(email || username || 'dept@eco.com');
      if (password === '123456' || (user && user.password === password)) {
        return res.json({
          success: true,
          user: {
            id: user ? user.id : 2,
            name: user ? user.name : 'Sanitation Dept Admin',
            email: email || 'dept@eco.com',
            role: 'dept_admin',
            department_id: user ? user.department_id : 1,
            department_name: user ? user.department_name : 'Health & Sanitation Department'
          }
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid Department Admin credentials' });
    }

    // Citizen login (via mobile/OTP or phone)
    if (phone) {
      let citizen = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
      if (!citizen) {
        const info = db.prepare('INSERT INTO users (name, phone, role) VALUES (?, ?, \'citizen\')').run(username || 'Citizen', phone);
        citizen = { id: Number(info.lastInsertRowid), name: username || 'Citizen', phone, role: 'citizen' };
      }
      return res.json({ success: true, user: citizen });
    }

    res.json({ success: true, user: { name: username || 'Citizen', role: 'citizen' } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 11. NOTIFICATIONS
// -----------------------------------------------------------------------------
app.get('/api/notifications', (req, res) => {
  try {
    const { phone, role = 'citizen' } = req.query;
    let query = 'SELECT * FROM notifications WHERE 1=1';
    const params = [];

    if (phone) {
      query += ' AND user_phone = ?';
      params.push(phone);
    } else if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    query += ' ORDER BY id DESC LIMIT 20';
    const notifications = db.prepare(query).all(...params);
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/notifications/:id/read', (req, res) => {
  try {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(Number(req.params.id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`[Eco-Saathi Server] Running on http://localhost:${PORT}`);
});
