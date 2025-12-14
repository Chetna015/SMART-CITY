import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./user/pages/Home";
import LoginCitizen from "./user/pages/LoginCitizen";
import SignupCitizen from "./user/pages/SignupCitizen";
import ReportIssue from "./user/pages/ReportIssue";
import TrackIssues from "./user/pages/TrackIssues";
import UserDashboard from "./user/pages/UserDashboard";
import Contact from "./user/pages/Contact";
import FAQ from "./user/pages/FAQ";
import About from "./user/pages/About";
import Services from "./user/pages/Services";
import SuperAdminLogin from "./admin/superadmin/pages/SuperAdminLogin";
import SuperAdminDashboard from "./admin/superadmin/pages/SuperAdminDashboard";
import SuperAdminIssueManagement from "./admin/superadmin/pages/SuperAdminIssueManagement";
import SuperAdminDepartments from "./admin/superadmin/pages/SuperAdminDepartments";
import SuperAdminCreateAdmin from "./admin/superadmin/pages/SuperAdminCreateAdmin";
import DeptDashboard from "./admin/department/pages/DeptDashboard";
import DeptIssueManagement from "./admin/department/pages/DeptIssueManagement";
import DeptDepartments from "./admin/department/pages/DeptDepartments";
import DeptReports from "./admin/department/pages/DeptReports";
import DeptSettings from "./admin/department/pages/DeptSettings";
import DeptLogin from "./admin/department/pages/DeptLogin";

import "./styles/globals.css"; // Tailwind global CSS

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/contact" element={<Contact />} />

        {/* USER ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginCitizen />} />
        <Route path="/signup" element={<SignupCitizen />} />
        <Route path="/faq" element={<FAQ />} />

        {/* USE ONLY ONE TRACK ROUTE */}
        <Route path="/track" element={<TrackIssues />} />

        <Route path="/report" element={<ReportIssue />} />
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* ADMIN ROUTES — later */}
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route
          path="/superadmin/issues"
          element={<SuperAdminIssueManagement />}
        />
        <Route
          path="/superadmin/departments"
          element={<SuperAdminDepartments />}
        />
        <Route
          path="/superadmin/create-admin"
          element={<SuperAdminCreateAdmin />}
        />

        {/* DEPARTMENT ADMIN ROUTES */}
        <Route path="/dept/dashboard" element={<DeptDashboard />} />
        <Route path="/dept/login" element={<DeptLogin />} />
        <Route path="/dept/issues" element={<DeptIssueManagement />} />
        <Route path="/dept/departments" element={<DeptDepartments />} />
        <Route path="/dept/reports" element={<DeptReports />} />
        <Route path="/dept/settings" element={<DeptSettings />} />

        <Route
          path="/superadmin/create-admin"
          element={<SuperAdminCreateAdmin />}
        />
      </Routes>
    </Router>
  );
}
