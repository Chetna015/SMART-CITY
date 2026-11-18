import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { 
  Building2, AlertTriangle, CheckCircle, Clock, 
  MapPin, ShieldAlert, Sparkles, RefreshCw 
} from "lucide-react";
import SuperAdminLayout from "../components/SuperAdminLayout";
import { getOverviewAnalytics, getIssues, API_BASE_URL } from "../../../services/api";

const PIE_COLORS = ["#16a34a", "#2563eb", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#64748b"];

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState([
    { label: "Total Issues", value: 0 },
    { label: "Pending Issues", value: 0 },
    { label: "In-Progress", value: 0 },
    { label: "Resolved Issues", value: 0 },
    { label: "Resolution Rate", value: "0%" }
  ]);
  const [pieData, setPieData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, issuesRes] = await Promise.all([
        getOverviewAnalytics(),
        getIssues()
      ]);

      if (analyticsRes.success) {
        setStats(analyticsRes.stats || []);
        setPieData(analyticsRes.pieData || []);
        setMonthlyData(analyticsRes.monthlyData || []);
      }

      if (issuesRes.success) {
        setIssues(issuesRes.issues || []);
      }
    } catch (err) {
      console.error("SuperAdmin Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ok = localStorage.getItem("superAdminAuth");
    if (!ok) {
      navigate("/superadmin/login");
    } else {
      loadData();
    }
  }, [navigate]);

  const getStatusMarkerColor = (status, priority) => {
    if (status === 'resolved') return "#16a34a"; // Green
    if (priority === 'High') return "#ef4444"; // Red for High priority
    if (status === 'in-progress' || status === 'accepted') return "#2563eb"; // Blue
    return "#f59e0b"; // Amber for pending
  };

  return (
    <SuperAdminLayout>
      <div className="p-6 sm:p-8 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 border border-green-200 uppercase">
              Varanasi Smart City Authority
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              City-Wide Command Center & Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Multi-department real-time civic intelligence, automated triage, and live GIS mapping.
            </p>
          </div>

          <button
            onClick={loadData}
            className="sa-btn px-4 py-2 text-sm font-semibold flex items-center gap-2 self-start sm:self-auto"
          >
            <RefreshCw size={16} /> Refresh Live Metrics
          </button>
        </div>

        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="sa-card p-5">
              <span className="text-xs text-gray-500 font-medium block">{s.label}</span>
              <h2 className="text-3xl font-extrabold text-green-700 mt-2">{s.value}</h2>
              <span className="text-[10px] text-gray-400 mt-1 block">Live Database Telemetry</span>
            </div>
          ))}
        </div>

        {/* INTERACTIVE LIVE GIS MAP (Image 0 & Image 1 requirement) */}
        <div className="sa-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="text-green-700" size={20} /> City-Wide Civic GIS Hotspot Map
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Plotting live issues with geolocation, AI category tagging, and urgency heat levels.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> High Urgency / Hazard
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span> In-Progress
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-green-600 inline-block"></span> Resolved
              </span>
            </div>
          </div>

          <div className="h-[380px] w-full border border-gray-200 overflow-hidden relative">
            <MapContainer
              center={[25.3176, 82.9739]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {issues.map((issue) => (
                <CircleMarker
                  key={issue.id}
                  center={[issue.lat || 25.3176, issue.lng || 82.9739]}
                  radius={issue.priority === 'High' ? 12 : 9}
                  pathOptions={{
                    color: getStatusMarkerColor(issue.status, issue.priority),
                    fillColor: getStatusMarkerColor(issue.status, issue.priority),
                    fillOpacity: 0.8,
                    weight: 2
                  }}
                >
                  <Popup>
                    <div className="text-xs max-w-[220px]">
                      <span className="font-mono font-bold text-green-700 bg-green-50 px-1 py-0.5 border border-green-200 block mb-1">
                        {issue.tracking_id}
                      </span>
                      <strong className="block text-gray-900 font-semibold mb-1 text-sm">{issue.title}</strong>
                      <p className="text-gray-600 mb-1"><strong>Area:</strong> {issue.area}</p>
                      <p className="text-gray-600 mb-1"><strong>Dept:</strong> {issue.department_name}</p>
                      <p className="text-gray-600 mb-2"><strong>Status:</strong> <span className="uppercase font-bold">{issue.status}</span></p>
                      {issue.image_url && (
                        <img
                          src={issue.image_url.startsWith('http') ? issue.image_url : `${API_BASE_URL}${issue.image_url}`}
                          alt="Proof"
                          className="w-full h-20 object-cover rounded border border-gray-200"
                        />
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* CHARTS ROW (RECHARTS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PIE CHART - ISSUES BY CATEGORY */}
          <div className="sa-card p-6">
            <h3 className="font-bold text-gray-900 text-base mb-1">
              Issues Classified by Category
            </h3>
            <p className="text-xs text-gray-500 mb-6">Distribution across municipal complaint categories.</p>

            <div className="h-[260px] flex items-center justify-center">
              {pieData.length === 0 ? (
                <p className="text-xs text-gray-400">Loading chart data...</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={85}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* BAR CHART - MONTHLY INTAKE */}
          <div className="sa-card p-6">
            <h3 className="font-bold text-gray-900 text-base mb-1">
              Monthly Issue Intake & Trend
            </h3>
            <p className="text-xs text-gray-500 mb-6">Volume of citizen submissions across recent reporting periods.</p>

            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="issues" fill="#16a34a" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
