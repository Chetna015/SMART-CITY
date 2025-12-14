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
} from "recharts";
import SuperAdminLayout from "../components/SuperAdminLayout";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const ok = localStorage.getItem("superAdminAuth");
    if (!ok) {
      navigate("/superadmin/login");
    }
  }, [navigate]);

  const stats = [
    { label: "Total Issues", value: 1247 },
    { label: "Pending Issues", value: 250 },
    { label: "Resolved Issues", value: 680 },
    { label: "Resolution Rate", value: "83%" },
  ];

  const pieData = [
    { name: "Garbage", value: 35 },
    { name: "Pothole", value: 28 },
    { name: "Streetlight", value: 15 },
    { name: "Water Logging", value: 22 },
  ];

  const COLORS = ["#1A73E8", "#FBBC05", "#EA4335", "#34A853"];

  const monthlyData = [
    { month: "Jan", issues: 40 },
    { month: "Feb", issues: 55 },
    { month: "Mar", issues: 30 },
    { month: "Apr", issues: 70 },
    { month: "May", issues: 65 },
    { month: "Jun", issues: 50 },
  ];

  return (
    <SuperAdminLayout>
      <div className="p-0">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="sa-card px-6 py-5">
                <p className="text-[var(--soft-text)]">{s.label}</p>
                <h2 className="text-3xl text-[var(--primary-blue)] font-semibold">
                  {s.value}
                </h2>
              </div>
            ))}
          </div>

          {/* Graphs Section */}
          <div className="grid grid-cols-2 gap-6 mt-10">
            {/* PIE CHART */}
            <div className="sa-card p-6">
              <h2 className="font-semibold mb-4">Issues by Category</h2>

              <PieChart width={350} height={260}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name }) => name}
                  outerRadius={100}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            {/* BAR CHART */}
            <div className="sa-card p-6">
              <h2 className="font-semibold mb-4">Monthly Issues</h2>

              <BarChart width={400} height={260} data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="issues" fill="var(--primary-blue)" />
              </BarChart>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
