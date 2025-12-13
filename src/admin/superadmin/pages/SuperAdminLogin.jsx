import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();

    // TEMP: Hardcoded credentials (Backend aane ke baad replace)
    if (form.email === "admin@eco.com" && form.password === "123456") {
      localStorage.setItem("superAdminAuth", "true");
      navigate("/superadmin/dashboard");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-accent">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-primary">
          Super Admin Login
        </h2>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            className="input"
            type="email"
            placeholder="Enter super admin email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Password</label>
          <input
            className="input"
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="btn mt-3">Login</button>
        </form>
      </div>
    </div>
  );
}
