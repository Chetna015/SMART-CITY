import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  const savedName = localStorage.getItem("citizenName") || "Citizen";

  const user = {
    name: savedName, // ← THIS SHOWS THE OTP LOGIN NAME
    email: "yashcube07@gmail.com",
    phone: "+91 9125900756",
    address: "Varanasi, Uttar Pradesh",
    image: "https://i.pravatar.cc/150?u=" + savedName,
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* DASHBOARD HEADER */}
        {/* DASHBOARD HEADER */}
        <div className="flex justify-between items-center mb-10">
          {/* LEFT SIDE — HEADING */}
          <h1 className="text-4xl font-bold text-green-700">
            Citizen Dashboard
          </h1>

          {/* RIGHT SIDE — BUTTON GROUP */}
          <div className="flex items-center gap-4">
            <button className="px-5 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700">
              Update Profile
            </button>

            <Link
              to="/report"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              + Report Issue
            </Link>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 mb-12 flex justify-between items-center">
          {/* LEFT SIDE — DETAILS */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Address:</strong> {user.address}
            </p>

            {/* UPDATE PROFILE BUTTON LEFT SIDE */}
          </div>

          {/* RIGHT SIDE — PROFILE PIC */}
          <div className="flex justify-center ml-10">
            <img
              src={user.image}
              alt="Profile"
              className="w-28 h-28 rounded-full border border-gray-300 object-cover shadow-sm"
            />
          </div>
        </div>

        {/* COMMUNITY SECTION */}
        <h2 className="text-2xl font-bold mb-4">Recent Community Reports</h2>

        <div className="space-y-5">
          {/* Example item */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">🗑️</span>
                <h3 className="text-lg font-semibold">
                  Overflowing garbage bin
                </h3>
              </div>
              <p className="text-gray-500 text-sm">MG Road & Brigade Road</p>
              <p className="text-gray-500 text-sm">Reported: 15/01/2024</p>
            </div>

            <span className="px-4 py-1 rounded-full bg-yellow-400 text-white text-sm font-medium">
              pending
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
