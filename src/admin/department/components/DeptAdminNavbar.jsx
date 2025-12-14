import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DeptAdminNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    const ok = window.confirm("Are you sure you want to logout?");
    if (!ok) return;
    localStorage.removeItem("superAdminAuth");
    localStorage.removeItem("citizenName");
    localStorage.removeItem("deptAuth");
    setOpen(false);
    navigate("/");
  }

  return (
    <div className="bg-[var(--white)] px-8 py-4 flex justify-between items-center border-b border-[var(--border)]">
      <h2 className="text-lg font-semibold text-[var(--primary-blue)]">
        Department Admin Dashboard
      </h2>

      <div className="relative">
        <button onClick={() => setOpen(!open)} className="sa-btn">
          Admin
        </button>

        {open && (
          <div className="absolute right-0 mt-2 bg-[var(--white)] border border-[var(--border)] w-40">
            <p className="px-3 py-2 cursor-pointer">Profile</p>
            <p onClick={handleLogout} className="px-3 py-2 cursor-pointer">
              Logout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
