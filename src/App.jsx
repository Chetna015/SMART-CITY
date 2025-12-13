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

import "./styles/globals.css"; // Tailwind global CSS
import Services from "./user/pages/Services";

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

        <Route path="/report" element={<ReportIssue />} />
        <Route path="/track" element={<TrackIssues />} />
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* ADMIN ROUTES — after UI is ready */}
        {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
        {/* <Route path="/admin/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}
