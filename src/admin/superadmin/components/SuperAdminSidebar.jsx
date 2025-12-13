import { NavLink } from "react-router-dom";
import { Home, ClipboardList, Layers, UserCog, LogOut } from "lucide-react";

export default function SuperAdminSidebar() {
  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-300 flex flex-col">
      {/* Profile Section */}
      <div className="p-6 border-b">
        <div className="w-14 h-14 bg-gray-200 rounded-full mx-auto" />
        <p className="text-center mt-3 font-semibold">Super Admin</p>
        <p className="text-center text-sm text-gray-500">+91 •••••• 43210</p>
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
      <div className="px-4 py-4 border-t">
        <NavLink
          to="/superadmin/login"
          className="flex items-center gap-3 text-red-600 hover:text-red-700 font-medium"
        >
          <LogOut size={18} />
          Logout
        </NavLink>
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
        `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
        ${
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
