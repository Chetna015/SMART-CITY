import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperAdminNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    const ok = window.confirm("Are you sure you want to logout?");
    if (!ok) return;
    // clear possible auth tokens
    localStorage.removeItem("superAdminAuth");
    localStorage.removeItem("citizenName");
    localStorage.removeItem("deptAuth");
    setOpen(false);
    navigate("/");
  }

  return (
    <div className="bg-[var(--white)] px-8 py-4 flex justify-between items-center border-b">
      <h2 className="text-xl font-bold text-[var(--primary-blue)]">
        Eco-Saathi — Super Admin
      </h2>

      <div className="relative">
        <img
          src="https://i.pravatar.cc/40"
          className="w-10 h-10 square-avatar cursor-pointer"
          onClick={() => setOpen(!open)}
        />

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-[var(--white)] border border-[var(--border)] p-2">
            <p className="px-3 py-2 cursor-pointer">Profile</p>
            <p
              onClick={handleLogout}
              className="px-3 py-2 text-red-500 cursor-pointer"
            >
              Logout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
