import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, CheckCircle, Clock, AlertTriangle, MapPin, ChevronRight, User, Phone, Shield } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getIssues, getNotifications } from "../../services/api";

export default function UserDashboard() {
  const [userName, setUserName] = useState("Citizen");
  const [userPhone, setUserPhone] = useState("9125900756");
  const [userIssues, setUserIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("citizenName");
    if (saved) setUserName(saved);

    async function loadData() {
      try {
        const [issuesRes, notifsRes] = await Promise.all([
          getIssues(),
          getNotifications({ phone: "9125900756" })
        ]);

        if (issuesRes.success && issuesRes.issues) {
          setUserIssues(issuesRes.issues);
        }
        if (notifsRes.success && notifsRes.notifications) {
          setNotifications(notifsRes.notifications);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalReports = userIssues.length;
  const pendingReports = userIssues.filter(i => i.status === 'pending').length;
  const activeReports = userIssues.filter(i => i.status === 'in-progress' || i.status === 'accepted').length;
  const resolvedReports = userIssues.filter(i => i.status === 'resolved').length;

  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-green-700 tracking-wider uppercase bg-green-50 px-2.5 py-1 border border-green-200">
              Verified Citizen Portal
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              Citizen Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome back, <strong>{userName}</strong>. Track your submitted civic reports and community actions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/report"
              className="sa-btn px-5 py-3 font-semibold flex items-center gap-2"
            >
              <Plus size={18} /> Report New Issue
            </Link>
          </div>
        </div>

        {/* METRICS OVERVIEW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="sa-card p-5">
            <span className="text-xs text-gray-500 font-medium block">Total Reported</span>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-2">{totalReports}</h3>
            <span className="text-[11px] text-gray-400 mt-1 block">City-wide reports</span>
          </div>

          <div className="sa-card p-5">
            <span className="text-xs text-gray-500 font-medium block">Pending AI Routing</span>
            <h3 className="text-3xl font-extrabold text-amber-600 mt-2">{pendingReports}</h3>
            <span className="text-[11px] text-amber-600 mt-1 block">Awaiting department triage</span>
          </div>

          <div className="sa-card p-5">
            <span className="text-xs text-gray-500 font-medium block">Action In-Progress</span>
            <h3 className="text-3xl font-extrabold text-blue-600 mt-2">{activeReports}</h3>
            <span className="text-[11px] text-blue-600 mt-1 block">Assigned to field squads</span>
          </div>

          <div className="sa-card p-5">
            <span className="text-xs text-gray-500 font-medium block">Resolved & Closed</span>
            <h3 className="text-3xl font-extrabold text-green-700 mt-2">{resolvedReports}</h3>
            <span className="text-[11px] text-green-700 mt-1 block">Successful municipal fixes</span>
          </div>
        </div>

        {/* PROFILE & RECENT COMMUNITY ISSUES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* USER PROFILE CARD */}
          <div className="sa-card p-6 h-fit">
            <h3 className="font-bold text-gray-900 text-lg mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
              <User size={18} className="text-green-700" /> Citizen Profile
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-800 font-bold text-2xl flex items-center justify-center border border-green-200">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{userName}</h4>
                <p className="text-xs text-gray-500">Citizen Reporter #9125</p>
                <span className="inline-block bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 mt-1">
                  Active Contributor
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-center justify-between">
                <span className="text-gray-400">Mobile:</span>
                <span className="font-medium text-gray-900">+91 9125900756</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-gray-400">Ward Zone:</span>
                <span className="font-medium text-gray-900">Varanasi Central / Zone A</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-gray-400">Language:</span>
                <span className="font-medium text-gray-900">Hindi / English</span>
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-2">
                Recent Civic Alerts
              </h4>
              {notifications.length === 0 ? (
                <p className="text-xs text-gray-500">No unread notifications.</p>
              ) : (
                <div className="space-y-2">
                  {notifications.slice(0, 3).map(n => (
                    <div key={n.id} className="bg-gray-50 p-2 text-xs border border-gray-100">
                      <span className="font-semibold text-gray-800 block">{n.title}</span>
                      <p className="text-gray-500 text-[11px] mt-0.5">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RECENT REPORTS LIST */}
          <div className="lg:col-span-2 sa-card p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="font-bold text-gray-900 text-lg">
                Live Community Feed & Status
              </h3>
              <Link to="/track" className="text-xs font-semibold text-green-700 hover:underline flex items-center gap-1">
                View All <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500 py-6 text-center">Loading reports...</p>
            ) : userIssues.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">No community issues logged yet.</p>
            ) : (
              <div className="space-y-4">
                {userIssues.slice(0, 5).map(issue => (
                  <div
                    key={issue.id}
                    className="p-4 border border-gray-200 hover:border-green-600 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5">
                          {issue.tracking_id}
                        </span>
                        <span className="text-xs text-gray-400 capitalize">{issue.category}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">{issue.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin size={12} /> {issue.area || issue.landmark} • {issue.department_name}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span className={`text-xs px-2.5 py-1 font-semibold uppercase ${
                        issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        issue.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        issue.status === 'accepted' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {issue.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
