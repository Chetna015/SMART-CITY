import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import DeptAdminLayout from "../components/DeptAdminLayout";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid
} from "recharts";
import { MapPin, ArrowRight, RefreshCw, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { getIssues, API_BASE_URL } from "../../../services/api";

export default function DeptDashboard() {
  const navigate = useNavigate();

  const [departmentName, setDepartmentName] = useState("Health & Sanitation Department");
  const [deptId, setDeptId] = useState(1);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch issues for this department
      const res = await getIssues({ department_id: deptId });
      if (res.success && res.issues) {
        setIssues(res.issues);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ok = localStorage.getItem("deptAuth");
    if (!ok) {
      navigate("/dept/login");
    } else {
      loadData();
    }
  }, [navigate]);

  const total = issues.length;
  const pending = issues.filter(i => i.status === 'pending').length;
  const inProgress = issues.filter(i => i.status === 'in-progress' || i.status === 'accepted').length;
  const resolved = issues.filter(i => i.status === 'resolved').length;

  const stats = [
    { label: "Total Assigned", value: total, sub: "All time received" },
    { label: "Pending Triage", value: pending, sub: "Require action", color: "text-amber-600" },
    { label: "Action In-Progress", value: inProgress, sub: "Field crew dispatched", color: "text-blue-600" },
    { label: "Successfully Resolved", value: resolved, sub: "Closed reports", color: "text-green-700" },
  ];

  const statusColors = {
    pending: "#f59e0b",
    accepted: "#6366f1",
    "in-progress": "#2563eb",
    resolved: "#16a34a",
    rejected: "#ef4444"
  };

  // Prepare chart data
  const chartData = [
    { status: "Pending", count: pending, color: "#f59e0b" },
    { status: "In-Progress", count: inProgress, color: "#2563eb" },
    { status: "Resolved", count: resolved, color: "#16a34a" }
  ];

  // Map center
  const center = useMemo(() => {
    if (!issues.length) return [25.3200, 82.9860];
    const lat = issues.reduce((s, i) => s + (i.lat || 25.32), 0) / issues.length;
    const lng = issues.reduce((s, i) => s + (i.lng || 82.98), 0) / issues.length;
    return [lat, lng];
  }, [issues]);

  return (
    <DeptAdminLayout>
      <div className="p-6 sm:p-8 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
          <div>
            <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 border border-green-200 uppercase">
              Department Command Center
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              {departmentName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Field operations dispatch, SLA tracking, and GIS live complaint monitoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={loadData} className="sa-btn secondary px-3 py-2 text-xs flex items-center gap-1">
              <RefreshCw size={14} /> Refresh
            </button>
            <Link to="/dept/issues" className="sa-btn px-4 py-2 text-sm font-semibold flex items-center gap-2">
              Manage Incident Queue <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="sa-card p-5">
              <span className="text-xs text-gray-500 font-medium block">{s.label}</span>
              <h2 className={`text-3xl font-extrabold mt-2 ${s.color || 'text-gray-900'}`}>{s.value}</h2>
              <span className="text-[11px] text-gray-400 mt-1 block">{s.sub}</span>
            </div>
          ))}
        </div>

        {/* MAP & CHART GRID (Image 0 & Image 1 requirements) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEAFLET GIS MAP */}
          <div className="lg:col-span-2 sa-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <MapPin size={18} className="text-green-700" /> Department Ward Hotspots
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Interactive GIS map with field report locations and status markers.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pending
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Active
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span> Fixed
                </span>
              </div>
            </div>

            <div className="h-[340px] w-full border border-gray-200 overflow-hidden relative">
              <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {issues.map((it) => (
                  <CircleMarker
                    key={it.id}
                    center={[it.lat || 25.32, it.lng || 82.98]}
                    radius={it.priority === 'High' ? 12 : 9}
                    pathOptions={{
                      color: statusColors[it.status] || "#f59e0b",
                      fillColor: statusColors[it.status] || "#f59e0b",
                      fillOpacity: 0.85,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div className="text-xs max-w-[200px]">
                        <span className="font-mono font-bold text-green-700 block mb-1">
                          {it.tracking_id}
                        </span>
                        <strong className="block text-gray-900 mb-1">{it.title}</strong>
                        <p className="text-gray-500 mb-1">{it.area}</p>
                        <span className="font-semibold uppercase text-xs block text-gray-700">
                          Status: {it.status}
                        </span>
                        {it.image_url && (
                          <img
                            src={it.image_url.startsWith('http') ? it.image_url : `${API_BASE_URL}${it.image_url}`}
                            alt="Evidence"
                            className="w-full h-16 object-cover mt-2 rounded border"
                          />
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* STATUS WORKLOAD CHART */}
          <div className="sa-card p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">
                Resolution Workload
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Active status distribution in this department's pipeline.
              </p>

              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="status" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Link
                to="/dept/issues"
                className="w-full sa-btn justify-center text-xs font-semibold py-2.5"
              >
                Open Incident Queue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DeptAdminLayout>
  );
}
