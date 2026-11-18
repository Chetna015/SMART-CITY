import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Lock, Mail, ArrowRight } from "lucide-react";
import { loginUser } from "../../../services/api";

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@eco.com", password: "123456" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser({ email: form.email, password: form.password, role: "superadmin" });
      if (res.success) {
        localStorage.setItem("superAdminAuth", "true");
        localStorage.setItem("userRole", "superadmin");
        navigate("/superadmin/dashboard");
      } else {
        setError(res.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      // Fallback demo credentials
      if (form.email === "admin@eco.com" && form.password === "123456") {
        localStorage.setItem("superAdminAuth", "true");
        navigate("/superadmin/dashboard");
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
            <Shield size={24} />
          </div>
          <span className="text-[11px] font-bold tracking-widest text-green-700 uppercase bg-green-50 px-2 py-0.5 border border-green-200">
            Municipal Command Access
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 mt-2">
            Super Administrator Login
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Access city-wide telemetry, department routing, and analytics.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                className="sa-input pl-10 text-sm"
                type="email"
                placeholder="admin@eco.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Secret Password
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
            <p className="font-semibold text-gray-800">Demo Super Admin Credentials:</p>
            <p>Email: <code className="text-green-700">admin@eco.com</code></p>
            <p>Password: <code className="text-green-700">123456</code></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sa-btn py-3 justify-center text-sm font-bold shadow-sm"
          >
            {loading ? "Authenticating..." : "Authorize Access"} <ArrowRight size={16} />
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
