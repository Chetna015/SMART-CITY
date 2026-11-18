import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building, Lock, Mail, ArrowRight } from "lucide-react";
import { loginUser } from "../../../services/api";

export default function DeptLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "dept@eco.com", password: "123456" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser({ email: form.username, password: form.password, role: "dept_admin" });
      if (res.success) {
        localStorage.setItem("deptAuth", "true");
        localStorage.setItem("userRole", "dept_admin");
        navigate("/dept/dashboard");
      } else {
        setError(res.message || "Invalid department credentials.");
      }
    } catch (err) {
      if (form.username === "dept@eco.com" && form.password === "123456") {
        localStorage.setItem("deptAuth", "true");
        navigate("/dept/dashboard");
      } else {
        setError("Network error or invalid credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 sa-card border border-gray-200 shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-700 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow">
            <Building size={24} />
          </div>
          <span className="text-[11px] font-bold tracking-widest text-green-700 uppercase bg-green-50 px-2 py-0.5 border border-green-200">
            Municipal Operations
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 mt-2">
            Department Admin Login
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Access departmental queues, assign crews, and log incident resolutions.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Department Username / Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                className="sa-input pl-10 text-sm"
                type="text"
                placeholder="dept@eco.com"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Access Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                className="sa-input pl-10 text-sm"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="p-3 bg-gray-50 border border-gray-200 text-[11px] text-gray-600">
            <p className="font-semibold text-gray-800">Demo Department Credentials:</p>
            <p>Username: <code className="text-green-700">dept@eco.com</code></p>
            <p>Password: <code className="text-green-700">123456</code></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sa-btn py-3 justify-center text-sm font-bold shadow-sm"
          >
            {loading ? "Authenticating..." : "Sign In to Department"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link to="/" className="text-xs text-green-700 hover:underline font-semibold">
            ← Return to Citizen Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
