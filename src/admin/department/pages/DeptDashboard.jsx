import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeptAdminLayout from "../components/DeptAdminLayout";
// Map and chart libraries. Install if missing: `npm install react-leaflet leaflet recharts`
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

export default function DeptDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const ok = localStorage.getItem("deptAuth");
    if (!ok) {
      navigate("/dept/login");
    }
  }, [navigate]);

  const stats = [
    { label: "Total Issues", value: 256 },
    { label: "Pending Issues", value: 78 },
    { label: "In-Progress", value: 96 },
    { label: "Resolved", value: 82 },
  ];

  // Add sample coordinates (lat/lng) for map plotting and a status for color-coding
  const issues = [
    {
      id: 1,
      title: "Streetlight not working near DLW Gate",
      priority: "High",
      status: "Pending",
      lat: 25.3176,
      lng: 82.9739,
    },
    {
      id: 2,
      title: "Garbage overflow at Sigra Market",
      priority: "Medium",
      status: "In-Progress",
      lat: 25.32,
      lng: 82.986,
    },
    {
      id: 3,
      title: "Large pothole near Cantt Road",
      priority: "High",
      status: "Resolved",
      lat: 25.31,
      lng: 82.978,
    },
  ];

  const statusColors = {
    Pending: "#ef4444",
    "In-Progress": "#f59e0b",
    Resolved: "#16a34a",
  };

  // compute center for the map
  const center = useMemo(() => {
    if (!issues.length) return [25.3176, 82.9739];
    const lat = issues.reduce((s, i) => s + (i.lat || 0), 0) / issues.length;
    const lng = issues.reduce((s, i) => s + (i.lng || 0), 0) / issues.length;
    return [lat, lng];
  }, [issues]);

  // prepare data for a simple status-count bar chart
  const chartData = Object.keys(statusColors).map((k) => ({
    status: k,
    count: issues.filter((i) => i.status === k).length,
  }));

  return (
    <DeptAdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold text-[var(--text)] mb-4">
          XYZ Department
        </h1>

        {/* Stats overview */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="sa-card p-6">
              <div className="text-sm text-[var(--soft-text)]">{s.label}</div>
              <div className="text-4xl font-extrabold mt-4">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Map + Chart Row */}
        <div className="grid grid-cols-2 gap-6">
          <div className="sa-card p-4 bg-white">
            <div className="text-sm text-[var(--soft-text)] mb-3 font-medium">
              Department Area
            </div>
            <div className="h-72 w-full">
              <MapContainer
                center={center}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {issues.map((it) => (
                  <CircleMarker
                    key={it.id}
                    center={[it.lat, it.lng]}
                    radius={10}
                    pathOptions={{
                      color: statusColors[it.status] || "#374151",
                      weight: 1,
                      fillOpacity: 0.8,
                    }}
                  >
                    <Popup>
                      <div className="text-sm font-semibold">{it.title}</div>
                      <div className="text-xs text-[var(--soft-text)]">
                        Priority: {it.priority}
                      </div>
                      <div className="mt-1 text-xs">
                        Status:{" "}
                        <span style={{ color: statusColors[it.status] }}>
                          {it.status}
                        </span>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
            <div className="mt-3 flex items-center gap-3">
              {Object.entries(statusColors).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      background: v,
                      borderRadius: 2,
                    }}
                  />
                  <div className="text-sm text-[var(--soft-text)]">{k}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="sa-card p-4 bg-white">
            <h3 className="text-lg font-semibold text-[var(--primary-blue)] mb-4">
              Monthly Issue Reports
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
                >
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count">
                    {chartData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={statusColors[entry.status]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DeptAdminLayout>
  );
}
