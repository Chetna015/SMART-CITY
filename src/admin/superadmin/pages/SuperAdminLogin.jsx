import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();

    // TEMP: Hardcoded credentials (replace when backend is ready)
    if (form.email === "admin@eco.com" && form.password === "123456") {
      localStorage.setItem("superAdminAuth", "true");
      navigate("/superadmin/dashboard");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-accent p-6">
      <div className="bg-white p-8 shadow sa-card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-primary">
          Super Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--soft-text)] mb-2">
              Email
            </label>
            <input
              className="sa-input w-full"
              type="email"
              placeholder="Enter super admin email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--soft-text)] mb-2">
              Password
            </label>
            <input
              className="sa-input w-full"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center justify-end">
            <button type="submit" className="sa-btn">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
