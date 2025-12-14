import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DeptLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    // TEMP: Hardcoded dept credentials (replace when backend is ready)
    if (form.username === "dept@eco.com" && form.password === "123456") {
      localStorage.setItem("deptAuth", "true");
      navigate("/dept/dashboard");
    } else {
      alert("Invalid department credentials. Please try again.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-accent p-6">
      <div className="bg-white p-8 shadow sa-card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-primary">
          Department Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--soft-text)] mb-2">
              Email / Username
            </label>
            <input
              className="sa-input w-full"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="dept@eco.com"
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
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter password"
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
