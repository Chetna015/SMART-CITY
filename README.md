# 🌿 Eco-Saathi (Smart Civic Issue Reporting & Municipal Management)

**Eco-Saathi** is an end-to-end full-stack civic platform that connects citizens with municipal departments to report, track, and resolve urban infrastructure and environmental issues with **AI automated categorization**, **urgency detection**, **department auto-routing**, and **real-time GIS map visualization**.

---

## 🏛️ System Architecture

```
[ Citizen App / Web ] ─── Photo / Voice / GPS ───► [ Eco-Saathi REST API (Port 5000) ]
                                                              │
                                       ┌──────────────────────┴──────────────────────┐
                                       ▼                                             ▼
                          [ AI Multi-Modal Engine ]                        [ SQLite Database ]
                         • Computer Vision Classifier                         • Issues & Logs
                         • Audio / NLP Keyword Analysis                       • Departments
                         • Urgency & Priority Detection                       • Users & Admins
                         • Automated Department Router                        • Notifications
                                       │
                                       ▼
                     ┌─────────────────┴─────────────────┐
                     ▼                                   ▼
        [ Department Admin Portal ]           [ Super Admin Command Center ]
       • Ward GIS Hotspot Map                • City-wide Hotspot GIS Map
       • Field Squad Assignment              • Recharts Category Breakdown
       • Accept / In-Progress / Resolve      • Monthly Submission Analytics
       • Citizen SMS/Notification Sync       • Admin Credential Provisioning
```

---

## 🚀 Key Features

### 1. Citizen Portal
- **Rapid Civic Reporting**: Capture photos via camera, record audio voice notes using the HTML5 `MediaRecorder` API, and auto-detect GPS coordinates with Google Maps preview.
- **AI Instant Assistant**: Live pre-analysis displaying predicted issue category, confidence score, urgency rating, and suggested municipal department.
- **Urgency Selection**: Citizen-controlled priority level (`Low`, `Medium`, `High`).
- **Live Public Tracker**: Real-time status tracker (`ECO-XXXX`) with audit timeline of actions taken.
- **Citizen Dashboard**: Personal metrics, recent community feed, and notification center.

### 2. AI Processing & Automated Routing Engine
- **Multi-Modal Vision & NLP**: Classifies civic issues into 7 municipal domains:
  1. *Health & Sanitation Department* (`garbage`)
  2. *Public Works Department - PWD* (`pothole`)
  3. *Electricity & Lighting Board* (`streetlight`)
  4. *Jal Sansthan - Water Works* (`water_leak`)
  5. *Sewage & Drainage Department* (`sewage`)
  6. *Traffic & Transport Authority* (`traffic_signal`)
  7. *Horticulture & Urban Forestry* (`tree`)
- **Automated Routing Rules**: Automatically matches the detected issue to the responsible department and establishes SLA resolution timelines (e.g. 12h for High priority, 24h for Medium).

### 3. Department Admin Operations (`/dept/*`)
- **Live Ward Hotspot Map**: Interactive Leaflet map displaying active complaints as color-coded circle markers.
- **Incident Queue & Triage**:
  - **Accept Task**: Assigns field crew / engineers.
  - **Mark In-Progress**: Logs field action.
  - **Resolve & Close**: Records resolution notes.
  - **Reject with Reason**: Dispatches explanation to citizen.

### 4. Super Admin Command Center (`/superadmin/*`)
- **City-wide GIS Map**: Real-time geographic visualization of all complaints across municipal wards.
- **Dynamic Recharts Analytics**: Category distribution pie charts, monthly intake bar charts, and SLA resolution rates.
- **Department & Admin Provisioning**: Add departments and register department administrators.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 7, Tailwind CSS v4, Lucide React, Leaflet, React-Leaflet, Recharts, React Router DOM v7.
- **Backend**: Node.js v22, Express, Multer, Native `node:sqlite` (SQLite 3).
- **Database**: `ecosaathi.db` (Persistent SQLite with WAL mode).

---

## ⚡ How to Run

### 1. Start the Backend API Server
```bash
npm run server
# Or: cd backend && node server.js
# Runs on http://localhost:5000
```

### 2. Start the Frontend Development Server
```bash
npm run dev
# Runs on http://localhost:5173
```

---

## 🔑 Demo Access Credentials

| Portal | URL | Username / Email | Password |
| :--- | :--- | :--- | :--- |
| **Citizen Login** | `/login` | Mobile: `9125900756` (OTP: `123456`) | N/A |
| **Department Admin** | `/dept/login` | `dept@eco.com` | `123456` |
| **Super Admin** | `/superadmin/login` | `admin@eco.com` | `123456` |
