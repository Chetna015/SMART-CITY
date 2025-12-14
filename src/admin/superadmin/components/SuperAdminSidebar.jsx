import { NavLink, useNavigate } from "react-router-dom";
import { Home, ClipboardList, Layers, UserCog, LogOut } from "lucide-react";

export default function SuperAdminSidebar() {
  const navigate = useNavigate();

  function handleLogout(e) {
    e.preventDefault();
    const ok = window.confirm("Are you sure you want to logout?");
    if (!ok) return;
    localStorage.removeItem("superAdminAuth");
    localStorage.removeItem("citizenName");
    localStorage.removeItem("deptAuth");
    navigate("/");
  }
  return (
    <div className="w-64 min-h-screen bg-[var(--white)] border-r border-[var(--border)] flex flex-col">
      {/* Profile Section */}
      <div className="p-6 border-b border-[var(--border)]">
        <div className="w-14 h-14 bg-gray-200 mx-auto square-avatar" />
        <p className="text-center mt-3 font-semibold">Super Admin</p>
        <p className="text-center text-sm text-[var(--soft-text)]">
          +91 •••••• 43210
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem
          to="/superadmin/dashboard"
          icon={<Home size={18} />}
          label="Dashboard"
        />
        <NavItem
          to="/superadmin/issues"
          icon={<ClipboardList size={18} />}
          label="Issue Management"
        />
        <NavItem
          to="/superadmin/departments"
          icon={<Layers size={18} />}
          label="Departments"
        />
        <NavItem
          to="/superadmin/create-admin"
          icon={<UserCog size={18} />}
          label="Create Dept Admin"
        />
      </nav>

      {/* Logout button bottom */}
      <div className="px-4 py-4 border-t border-[var(--border)]">
        <a
          href="#"
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-600 font-medium"
        >
          <LogOut size={18} />
          Logout
        </a>
      </div>
    </div>
  );
}

/* ---- REUSABLE COMPONENT ---- */
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
