import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Shield, Building, Menu, X, Search, LogOut } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [citizenName, setCitizenName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("citizenName");
    if (saved) {
      setCitizenName(saved);
    }
  }, [location]);

  const handleSignOut = () => {
    localStorage.removeItem("citizenName");
    localStorage.removeItem("citizenPhone");
    localStorage.removeItem("userRole");
    setCitizenName("");
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3.5">
        {/* LEFT LOGO */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-green-700 flex items-center justify-center text-white text-lg font-bold shadow-sm">
            <span>🌿</span>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-green-800 tracking-tight leading-none">
              Eco-Saathi
            </h2>
            <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
              Smart Civic Platform
            </span>
          </div>
        </Link>

        {/* TOP BAR - ONLY HOME, TRACK ISSUE, CITIZEN PORTAL */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <Link
            to="/"
            className={`hover:text-green-700 transition ${
              location.pathname === "/" ? "text-green-700 font-bold" : ""
            }`}
          >
            Home
          </Link>

          <Link
            to="/track"
            className={`hover:text-green-700 transition flex items-center gap-1.5 ${
              location.pathname === "/track" ? "text-green-700 font-bold" : ""
            }`}
          >
            <Search size={15} /> Track Issue
          </Link>

          <Link
            to="/dashboard"
            className={`hover:text-green-700 transition ${
              location.pathname === "/dashboard" ? "text-green-700 font-bold" : ""
            }`}
          >
            Citizen Portal
          </Link>
        </div>

        {/* RIGHT - SHOW ONLY USER NAME WHEN SIGNED IN */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="sa-btn px-4 py-2 text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              {citizenName ? (
                <>
                  <User size={14} />
                  <span>{citizenName}</span>
                </>
              ) : (
                <>
                  <Shield size={14} />
                  <span>Login</span>
                </>
              )}
            </button>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-xl w-56 z-50 animate-fadeIn divide-y divide-gray-100">
                <div className="p-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 block mb-1">
                    {citizenName ? "Citizen Session" : "Citizen Access"}
                  </span>
                  {citizenName ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-green-50 hover:text-green-800 transition"
                      >
                        <User size={14} /> My Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-green-50 hover:text-green-800 transition"
                    >
                      <User size={14} /> Citizen Login / OTP
                    </Link>
                  )}
                </div>

                <div className="p-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 block mb-1">
                    Municipal Authority
                  </span>
                  <Link
                    to="/dept/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-green-50 hover:text-green-800 transition"
                  >
                    <Building size={14} /> Department Admin
                  </Link>
                  <Link
                    to="/superadmin/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-green-50 hover:text-green-800 transition"
                  >
                    <Shield size={14} /> Super Admin Command
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden text-gray-700 p-1"
        >
          {mobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE NAV DRAWER */}
      {mobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenu(false)}
            className="block py-2 text-sm font-semibold text-gray-700"
          >
            Home
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenu(false)}
            className="block py-2 text-sm font-semibold text-gray-700"
          >
            Track Issue
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenu(false)}
            className="block py-2 text-sm font-semibold text-gray-700"
          >
            Citizen Portal
          </Link>
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            {citizenName ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenu(false);
                }}
                className="sa-btn secondary text-xs py-2 justify-center text-red-600"
              >
                Sign Out ({citizenName})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenu(false)}
                className="sa-btn text-xs py-2 justify-center"
              >
                Citizen Login
              </Link>
            )}
            <Link
              to="/dept/login"
              onClick={() => setMobileMenu(false)}
              className="sa-btn secondary text-xs py-2 justify-center"
            >
              Department Admin
            </Link>
            <Link
              to="/superadmin/login"
              onClick={() => setMobileMenu(false)}
              className="sa-btn secondary text-xs py-2 justify-center"
            >
              Super Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
