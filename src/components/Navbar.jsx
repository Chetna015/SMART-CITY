import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm border-b border-borderCol">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* LEFT LOGO */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-lg font-bold">
            <span>📍</span>
          </div>
          <h2 className="text-xl font-semibold text-green-700">Eco-Saathi</h2>
        </div>

        {/* CENTER LINKS */}
        <div className="hidden md:flex gap-10 text-secondary font-medium">
          <a href="/" className="hover:text-green-600 transition">
            Home
          </a>
          <a href="/contact" className="hover:text-green-600 transition">
            Contact us
          </a>
          <a href="/faq" className="hover:text-green-600 transition">
            FAQ’s
          </a>
          <a href="/about" className="hover:text-green-600 transition">
            About us
          </a>
        </div>

        {/* RIGHT LOGIN DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="bg-green-600 text-white px-5 py-2 rounded-md font-medium hover:bg-green-700 transition"
          >
            Login
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-2 bg-white border border-borderCol rounded-md shadow-lg w-32">
              <a
                href="/login"
                className="block px-4 py-2 hover:bg-accent text-secondary"
              >
                as Citizen
              </a>
              <a
                href="/admin/login"
                className="block px-4 py-2 hover:bg-accent text-secondary"
              >
                as Admin
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
