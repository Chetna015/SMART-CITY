import { NavLink } from "react-router-dom";
import { Home, ClipboardList, Layers, PieChart, Settings } from "lucide-react";

export default function DeptAdminSidebar() {
  return (
    <div className="w-64 min-h-screen bg-[var(--white)] border-r border-[var(--border)] flex flex-col">
      <div className="p-6 border-b border-[var(--border)]">
        <div className="w-14 h-14 bg-[var(--primary-blue)] mx-auto square-avatar flex items-center justify-center text-white">
          DA
        </div>
        <p className="text-center mt-3 font-semibold">Department Admin</p>
        <p className="text-center text-sm text-[var(--soft-text)]">
          Garbage Dept • +91 ••••• 43210
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem
          to="/dept/dashboard"
          icon={<Home size={16} />}
          label="Dashboard"
        />
        <NavItem
          to="/dept/issues"
          icon={<ClipboardList size={16} />}
          label="Issue Management"
        />
        <NavItem
          to="/dept/departments"
          icon={<Layers size={16} />}
          label="Departments"
        />
        <NavItem
          to="/dept/reports"
          icon={<PieChart size={16} />}
          label="Reports"
        />
        <NavItem
          to="/dept/settings"
          icon={<Settings size={16} />}
          label="Settings"
        />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sa-nav-item text-sm font-medium ${
          isActive ? "sa-nav-item active" : ""
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
