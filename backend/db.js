import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '..', 'ecosaathi.db');

export const db = new DatabaseSync(dbPath);

// Enable WAL mode and foreign keys for high performance
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      category_key TEXT NOT NULL,
      head TEXT,
      phone TEXT,
      email TEXT,
      zone TEXT,
      active INTEGER DEFAULT 1,
      sla_hours INTEGER DEFAULT 24
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'citizen',
      department_id INTEGER,
      password TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracking_id TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'Medium',
      status TEXT NOT NULL DEFAULT 'pending',
      lat REAL,
      lng REAL,
      area TEXT,
      landmark TEXT,
      location_address TEXT,
      image_url TEXT,
      audio_url TEXT,
      ai_confidence REAL DEFAULT 0.92,
      ai_tags TEXT,
      ai_analysis TEXT,
      reporter_name TEXT,
      reporter_phone TEXT,
      department_id INTEGER,
      department_name TEXT,
      assigned_staff TEXT,
      rejection_reason TEXT,
      resolution_remarks TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_phone TEXT,
      role TEXT DEFAULT 'citizen',
      issue_id INTEGER,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      issue_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      actor TEXT NOT NULL,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS email_otps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      identifier TEXT NOT NULL,
      otp_hash TEXT NOT NULL,
      attempts INTEGER DEFAULT 0,
      expires_at_ms INTEGER NOT NULL,
      created_at_ms INTEGER NOT NULL
    );
  `);

  seedData();
}

function seedData() {
  // Check if departments exist
  const deptCount = db.prepare('SELECT count(*) as count FROM departments').get().count;
  if (deptCount === 0) {
    const insertDept = db.prepare(`
      INSERT INTO departments (name, category_key, head, phone, email, zone, active, sla_hours)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const depts = [
      ['Health & Sanitation Department', 'garbage', 'Sonia Verma', '+91 91234 56789', 'sanitation@eco.gov.in', 'Zone A - Sigra & Central', 1, 24],
      ['Public Works Department (PWD)', 'pothole', 'Ramesh Kumar', '+91 98765 43210', 'pwd@eco.gov.in', 'Zone B - Cantt & North', 1, 48],
      ['Electricity & Lighting Board', 'streetlight', 'Anil Sharma', '+91 98221 12345', 'lighting@eco.gov.in', 'Zone C - DLW & South', 1, 18],
      ['Jal Sansthan (Water Works)', 'water_leak', 'Pooja Tiwari', '+91 99112 33445', 'water@eco.gov.in', 'Zone D - Bhelupur & Dashashwamedh', 1, 12],
      ['Sewage & Drainage Department', 'sewage', 'Vikram Yadav', '+91 94150 99887', 'sewage@eco.gov.in', 'Zone E - Assi & Lanka', 1, 24],
      ['Traffic & Transport Authority', 'traffic_signal', 'Manish Gupta', '+91 93350 44556', 'traffic@eco.gov.in', 'Zone Central', 1, 6],
      ['Horticulture & Urban Forestry', 'tree', 'Dr. Radhika Sen', '+91 97210 77665', 'parks@eco.gov.in', 'All Zones', 1, 36],
    ];

    for (const d of depts) {
      insertDept.run(...d);
    }
  }

  // Seed default admin accounts
  const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (name, email, phone, role, department_id, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertUser.run('Super Administrator', 'admin@eco.com', '+91 99999 00001', 'superadmin', null, '123456');
    insertUser.run('Sanitation Dept Admin', 'dept@eco.com', '+91 91234 56789', 'dept_admin', 1, '123456');
    insertUser.run('PWD Admin', 'pwd@dept.com', '+91 98765 43210', 'dept_admin', 2, '123456');
    insertUser.run('Lighting Admin', 'lighting@dept.com', '+91 98221 12345', 'dept_admin', 3, '123456');
    insertUser.run('Citizen Yash', 'yashcube07@gmail.com', '9125900756', 'citizen', null, '123456');
  }

  // Seed realistic sample issues around Varanasi for immediate interactive map and analytics visualization
  const issueCount = db.prepare('SELECT count(*) as count FROM issues').get().count;
  if (issueCount === 0) {
    const insertIssue = db.prepare(`
      INSERT INTO issues (
        tracking_id, title, description, category, priority, status,
        lat, lng, area, landmark, location_address, image_url, audio_url,
        ai_confidence, ai_tags, ai_analysis, reporter_name, reporter_phone,
        department_id, department_name, assigned_staff, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?))
    `);

    const sampleIssues = [
      [
        'ECO-2401',
        'Overflowing garbage bin near Sigra Vegetable Market',
        'Municipal waste container completely filled, solid waste spilling onto the main pedestrian sidewalk creating sanitary hazard.',
        'garbage',
        'High',
        'pending',
        25.3200,
        82.9860,
        'Sigra Market',
        'Near SBI Sigra Branch',
        'Sigra, Varanasi, UP 221002',
        '/uploads/sample_garbage.svg',
        null,
        0.95,
        '["waste", "overflowing", "sanitation_hazard", "pedestrian_block"]',
        'AI detected high accumulation of solid organic & plastic waste with 95% confidence. Urgency high due to proximity to market.',
        'Rajesh Kumar',
        '9876543210',
        1,
        'Health & Sanitation Department',
        null,
        '-2 hours'
      ],
      [
        'ECO-2402',
        'Large deep pothole on Commercial Road',
        'Deep circular pothole approximately 1.5m wide near junction, dangerous for two-wheelers especially during evening traffic.',
        'pothole',
        'High',
        'in-progress',
        25.3100,
        82.9780,
        'Cantt Road',
        'Opposite Railway Officer Colony',
        'Cantt Road, Varanasi, UP 221002',
        '/uploads/sample_pothole.svg',
        null,
        0.92,
        '["asphalt_depression", "structural_damage", "accident_risk"]',
        'AI detected asphalt fissure and deep depression exceeding 10cm depth. Poses severe road safety hazard.',
        'Priya Sharma',
        '9811122233',
        2,
        'Public Works Department (PWD)',
        'Inspector Amit Verma',
        '-1 days'
      ],
      [
        'ECO-2403',
        'Streetlight pole non-functional near DLW Main Gate',
        'Pole #DLW-44 has been dark for past 4 days, causing safety concerns for university students and residents returning late.',
        'streetlight',
        'Medium',
        'accepted',
        25.3176,
        82.9739,
        'DLW Gate',
        'Near DLW Hospital Crossing',
        'DLW Colony, Varanasi, UP 221004',
        '/uploads/sample_light.svg',
        null,
        0.96,
        '["electrical", "illumination_failure", "safety_corridor"]',
        'AI verified streetlight bulb/wiring failure from citizen voice description & photo.',
        'Amit Patel',
        '9944455566',
        3,
        'Electricity & Lighting Board',
        'Electrician Sunil Rao',
        '-3 days'
      ],
      [
        'ECO-2404',
        'Water pipeline burst causing road flooding in Bhelupur',
        'Underground fresh water main line leaking continuously, flooding local street and low water pressure in nearby houses.',
        'water_leak',
        'High',
        'in-progress',
        25.3050,
        82.9920,
        'Bhelupur',
        'Near Kamachha Crossing',
        'Bhelupur, Varanasi, UP 221010',
        '/uploads/sample_water.svg',
        null,
        0.91,
        '["freshwater_loss", "pipe_rupture", "flooding"]',
        'AI detected significant surface water accumulation stemming from subsurface pressurized water main.',
        'Sneha Reddy',
        '9711133344',
        4,
        'Jal Sansthan (Water Works)',
        'Engineer Ravi Kant',
        '-4 hours'
      ],
      [
        'ECO-2405',
        'Broken tree branch blocking traffic lane on Assi Road',
        'Large neem tree branch fractured after heavy winds, partially blocking two-way vehicular movement near Assi Ghat turn.',
        'tree',
        'Medium',
        'resolved',
        25.2980,
        83.0030,
        'Assi Ghat',
        'Near Assi Crossing',
        'Assi Ghat Road, Varanasi, UP 221005',
        '/uploads/sample_tree.svg',
        null,
        0.94,
        '["fallen_branch", "traffic_obstruction", "horticulture"]',
        'AI detected vegetative road obstruction with 94% confidence.',
        'Vikram Singh',
        '9415012345',
        7,
        'Horticulture & Urban Forestry',
        'Rescue Squad 3',
        '-5 days'
      ],
      [
        'ECO-2406',
        'Open sewage manhole lid near Dashashwamedh',
        'Hazardous open manhole cover left uncovered during night, urgent barricading and replacement needed.',
        'sewage',
        'High',
        'resolved',
        25.3070,
        83.0100,
        'Dashashwamedh',
        'Near Godowlia Roundabout',
        'Godowlia, Varanasi, UP 221001',
        '/uploads/sample_sewage.svg',
        null,
        0.98,
        '["open_manhole", "extreme_fall_hazard", "sewer_overflow"]',
        'AI flagged critical pedestrian hazard: Missing manhole lid in high foot-traffic heritage corridor.',
        'Alok Mishra',
        '9125900756',
        5,
        'Sewage & Drainage Department',
        'Sanitation Officer S. Singh',
        '-6 days'
      ]
    ];

    for (const item of sampleIssues) {
      insertIssue.run(...item);
    }

    // Insert sample notifications
    const insertNotif = db.prepare(`
      INSERT INTO notifications (user_phone, role, issue_id, title, message, type)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertNotif.run('9125900756', 'citizen', 6, 'Issue Resolved!', 'Your report ECO-2406 (Open sewage manhole lid) has been successfully resolved by Sewage & Drainage Department.', 'status_change');
    insertNotif.run('9811122233', 'citizen', 2, 'Work Started', 'Your report ECO-2402 (Large deep pothole) is now In-Progress with PWD repair team.', 'status_change');
    insertNotif.run('91234 56789', 'dept_admin', 1, 'New Urgent Report Routed', 'AI Engine routed high priority issue ECO-2401 to Health & Sanitation Department.', 'urgent');
  }
}
