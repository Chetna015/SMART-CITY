import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  // Dummy user profile (later backend se aa jayega)
  const [user, setUser] = useState({
    name: "Suyash Prakash",
    email: "yashcube07@gmail.com",
    profilePic: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  });

  // Dummy issues reported by user
  const issues = [
    {
      id: 1,
      title: "Broken Street Light",
      date: "Dec 10, 2025",
      status: "Pending",
      icon: "💡",
    },
    {
      id: 2,
      title: "Pothole on Road",
      date: "Dec 8, 2025",
      status: "Accepted",
      icon: "🚧",
    },
    {
      id: 3,
      title: "Garbage Overflow",
      date: "Dec 5, 2025",
      status: "Resolved",
      icon: "🗑️",
    },
  ];

  const statusColor = {
    Pending: "bg-yellow-400 text-white",
    Accepted: "bg-blue-600 text-white",
    "In Progress": "bg-purple-600 text-white",
    Resolved: "bg-green-600 text-white",
  };

  return (
    <>
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-12">
        {/* Dashboard Heading */}
        <h1 className="text-4xl font-bold text-center text-green-700">
          Citizen Dashboard
        </h1>
        <p className="text-center text-secondary mb-10">
          Track your submitted issues and monitor their progress.
        </p>

        {/* Profile Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-borderCol max-w-xl mx-auto flex items-center gap-6 mb-12">
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <h2 className="text-xl font-semibold text-dark">{user.name}</h2>
            <p className="text-secondary">{user.email}</p>

            <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Update Profile
            </button>
          </div>
        </div>

        {/* Add Issue Button */}
        <div className="text-center mb-10">
          <Link
            to="/report"
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
          >
            + Report New Issue
          </Link>
        </div>

        {/* Issues List */}
        <h2 className="text-2xl font-bold text-dark mb-6">
          Your Reported Issues
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="p-6 bg-white rounded-2xl shadow-sm border border-borderCol hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{issue.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-dark">
                    {issue.title}
                  </h3>
                  <p className="text-secondary">Date Reported: {issue.date}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <Link
                  to="/track"
                  className="text-blue-600 font-medium hover:underline"
                >
                  View Status →
                </Link>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    statusColor[issue.status]
                  }`}
                >
                  {issue.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
