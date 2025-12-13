import { useState } from "react";

export default function SuperAdminNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white shadow-sm px-8 py-4 flex justify-between items-center border-b">
      <h2 className="text-xl font-bold text-blue-700">
        Eco-Saathi — Super Admin
      </h2>

      <div className="relative">
        <img
          src="https://i.pravatar.cc/40"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={() => setOpen(!open)}
        />

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg border p-2">
            <p className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
              Profile
            </p>
            <p className="px-3 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">
              Logout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
