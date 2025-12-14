import DeptAdminLayout from "../components/DeptAdminLayout";
import { Eye } from "lucide-react";
import { useState } from "react";

export default function DeptIssueManagement() {
  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [viewMode, setViewMode] = useState("accepted"); // 'accepted' or 'new'
  const [modalArea, setModalArea] = useState("");
  const [issues, setIssues] = useState([
    {
      id: 1,
      title: "Overflowing garbage bin",
      status: "pending",
      reporter: "Rajesh Kumar",
      date: "15/01/2024",
      area: null,
    },
    {
      id: 2,
      title: "Large pothole on Commercial Street",
      status: "in-progress",
      reporter: "Priya Sharma",
      date: "12/01/2024",
      area: "Commercial Street",
    },
    {
      id: 3,
      title: "Street light not working",
      status: "resolved",
      reporter: "Amit Patel",
      date: "08/01/2024",
      area: "Cantt Road",
    },
    {
      id: 4,
      title: "Waterlogging after monsoon",
      status: "pending",
      reporter: "Sneha Reddy",
      date: "14/01/2024",
      area: null,
    },
    {
      id: 5,
      title: "Broken street light",
      status: "in-progress",
      reporter: "Vikram Singh",
      date: "13/01/2024",
      area: "Sector 7",
    },
  ]);

  const statusColor = (s) => {
    switch (s) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-amber-100 text-amber-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  function openModal(it) {
    setRejectReason("");
    setSelected(it);
    setModalArea(it.area || "");
  }

  function closeModal() {
    setSelected(null);
  }

  function acceptIssue(issue) {
    // mark issue as accepted and set area
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issue.id
          ? { ...i, status: "accepted", area: modalArea || i.area }
          : i
      )
    );
    setViewMode("accepted");
    closeModal();
  }

  function rejectIssue(issue) {
    // TODO: call API to reject with reason
    console.log("Rejected", issue.id, rejectReason);
    closeModal();
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // compute visible issues with current viewMode, search and status filter
  const visible = issues
    .filter((i) =>
      viewMode === "new" ? i.status === "pending" : i.status !== "pending"
    )
    .filter((i) => (filterStatus ? i.status === filterStatus : true))
    .filter((i) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        (i.title && i.title.toLowerCase().includes(q)) ||
        (i.reporter && i.reporter.toLowerCase().includes(q)) ||
        (i.area && i.area.toLowerCase().includes(q))
      );
    });

  return (
    <DeptAdminLayout>
      <div className="p-6">
        {/* Top segmented bar */}
        <div className="flex border border-[var(--border)] overflow-hidden rounded-none mb-4">
          <button
            onClick={() => setViewMode("accepted")}
            className={`flex-1 text-center py-2 ${
              viewMode === "accepted"
                ? "bg-[#16a34a] text-white"
                : "bg-[#f3f4f6]"
            }`}
          >
            Accepted issues
          </button>
          <button
            onClick={() => setViewMode("new")}
            className={`flex-1 text-center py-2 relative ${
              viewMode === "new" ? "bg-[#16a34a] text-white" : "bg-[#f3f4f6]"
            }`}
          >
            New reported issues
            <span className="ml-2 inline-block bg-red-600 text-white rounded-full px-2 text-xs align-middle">
              {issues.filter((i) => i.status === "pending").length}
            </span>
          </button>
        </div>

        {/* Filters: single search (title/area/reporter) + status selector */}
        {/* Filters: two-column row: search (left) + status select (right) */}
        <div className="sa-card mb-6 p-4 border border-gray-200 rounded-none shadow-none">
          <div className="flex w-full items-center gap-4">
            {/* Left: Search (50%) */}
            <div className="basis-1/2">
              <div className="flex items-center border border-gray-200 p-2 rounded-none">
                {/* search icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 6.65a7.5 7.5 0 010 10.6z"
                  />
                </svg>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search all (issue title, reporter, area)"
                  aria-label="Search issues by title, reporter, or area"
                  className="flex-1 outline-none bg-transparent text-sm"
                />
              </div>
            </div>

            {/* Right: Status select (50%) */}
            <div className="basis-1/2">
              <div className="relative border border-gray-200 p-2 rounded-none">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  aria-label="Filter issues by status"
                  className="w-full appearance-none bg-transparent outline-none text-sm pr-8"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="resolved">Resolved</option>
                </select>

                {/* dropdown arrow */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Issues table */}
        <div className="sa-card p-4">
          {/* filter issues by viewMode */}
          {/** show pending issues when 'new', otherwise show non-pending (accepted/resolved/in-progress) */}
          <h3 className="text-sm text-[var(--soft-text)] mb-4">
            Issues ({visible.length})
          </h3>

          <table className="w-full sa-table">
            <thead>
              <tr className="text-left text-sm text-[var(--soft-text)]">
                <th className="py-3">Issue</th>
                <th>Status</th>
                <th>Reporter</th>
                <th>Date</th>
                {viewMode === "accepted" ? <th>Area</th> : null}
                <th>{viewMode === "new" ? "Actions" : "View"}</th>
              </tr>
            </thead>

            <tbody>
              {visible.map((it) => (
                <tr key={it.id}>
                  <td className="py-4">
                    <div className="font-medium">{it.title}</div>
                    <div className="text-xs text-[var(--soft-text)]">
                      Manage and track all reported civic issues
                    </div>
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${statusColor(
                        it.status
                      )}`}
                    >
                      {it.status}
                    </span>
                  </td>

                  <td className="text-sm">{it.reporter}</td>
                  <td className="text-sm">{it.date}</td>

                  {viewMode === "accepted" ? (
                    <td className="text-sm">{it.area || "-"}</td>
                  ) : null}

                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(it)}
                        className="sa-btn px-3 py-1"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal (View) */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-30"
            onClick={closeModal}
          ></div>

          <div className="relative bg-white w-[900px] max-w-[95%] max-h-[90%] overflow-auto p-6 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selected.title}</h2>
                <div className="text-sm text-[var(--soft-text)]">
                  Issue Details
                </div>
              </div>

              <button
                onClick={closeModal}
                className="border border-green-200 rounded-md p-1 text-green-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <div className="w-full h-56 bg-gray-100 overflow-hidden rounded-md">
                {selected.image ? (
                  <img
                    src={selected.image}
                    alt={selected.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-[var(--soft-text)]">
                    Image placeholder
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <div className="text-sm text-[var(--soft-text)]">Status</div>
                  <div className="font-medium mt-1">{selected.status}</div>
                </div>

                <div>
                  <div className="text-sm text-[var(--soft-text)]">
                    Reporter
                  </div>
                  <div className="font-medium mt-1">{selected.reporter}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-[var(--soft-text)]">
                  Reported Date
                </div>
                <div className="font-medium mt-1">{selected.date}</div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-[var(--soft-text)]">
                  Description
                </div>
                <p className="mt-2 text-sm">
                  {selected.description || "No description provided."}
                </p>
              </div>

              {/* Accept / Reject area retained below for pending items */}
              {selected.status === "pending" && (
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => acceptIssue(selected)}
                    className="sa-btn"
                    style={{ background: "#16a34a", color: "white" }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectIssue(selected)}
                    className="sa-btn"
                    style={{ background: "#ef4444", color: "white" }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DeptAdminLayout>
  );
}
