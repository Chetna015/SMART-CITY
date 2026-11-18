import { useState, useEffect } from "react";
import { 
  Eye, CheckCircle2, Clock, XCircle, Search, Filter, 
  MapPin, User, Phone, Building2, Check, Sparkles, X, AlertTriangle 
} from "lucide-react";
import DeptAdminLayout from "../components/DeptAdminLayout";
import { getIssues, updateIssueStatus, API_BASE_URL } from "../../../services/api";

export default function DeptIssueManagement() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'pending', 'in-progress', 'resolved'
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [selected, setSelected] = useState(null);
  const [assignedStaff, setAssignedStaff] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [resolutionRemarks, setResolutionRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const loadIssues = async () => {
    setLoading(true);
    try {
      const res = await getIssues({ department_id: 1 });
      if (res.success && res.issues) {
        setIssues(res.issues);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const openActionModal = (item) => {
    setSelected(item);
    setAssignedStaff(item.assigned_staff || "Field Crew Alpha");
    setRejectReason(item.rejection_reason || "");
    setResolutionRemarks(item.resolution_remarks || "Inspection completed and hazard cleared.");
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selected) return;
    if (newStatus === "rejected" && !rejectReason.trim()) {
      alert("Please provide a reason for rejecting the report.");
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        status: newStatus,
        assigned_staff: assignedStaff,
        rejection_reason: newStatus === "rejected" ? rejectReason : null,
        resolution_remarks: newStatus === "resolved" ? resolutionRemarks : null,
        actor: "Health & Sanitation Dept Officer"
      };

      const res = await updateIssueStatus(selected.id, payload);
      if (res.success) {
        setFeedbackMsg(`Issue ${selected.tracking_id} successfully updated to ${newStatus.toUpperCase()}!`);
        setSelected(null);
        loadIssues();
        setTimeout(() => setFeedbackMsg(""), 4000);
      }
    } catch (err) {
      alert("Error updating status. Please check backend connection.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredIssues = issues.filter((it) => {
    const matchesTab =
      activeTab === "all" ? true :
      activeTab === "pending" ? it.status === "pending" :
      activeTab === "in-progress" ? (it.status === "in-progress" || it.status === "accepted") :
      it.status === activeTab;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      it.title.toLowerCase().includes(q) ||
      it.tracking_id.toLowerCase().includes(q) ||
      (it.area && it.area.toLowerCase().includes(q));

    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved":
        return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 font-bold uppercase">Resolved</span>;
      case "in-progress":
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 font-bold uppercase">In-Progress</span>;
      case "accepted":
        return <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-0.5 font-bold uppercase">Accepted</span>;
      case "rejected":
        return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 font-bold uppercase">Rejected</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 font-bold uppercase">Pending</span>;
    }
  };

  return (
    <DeptAdminLayout>
      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Department Incident Queue</h1>
            <p className="text-sm text-gray-500 mt-1">
              Review incoming AI-routed complaints, assign squads, and dispatch field resolutions.
            </p>
          </div>

          <span className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 border border-green-200 self-start sm:self-auto">
            {issues.length} Total Department Tasks
          </span>
        </div>

        {feedbackMsg && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-2">
            <CheckCircle2 size={18} /> {feedbackMsg}
          </div>
        )}

        {/* CONTROLS: TABS & SEARCH */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
          {/* TABS */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
            {[
              { key: "all", label: "All Tasks" },
              { key: "pending", label: "Pending Triage" },
              { key: "in-progress", label: "Active Operations" },
              { key: "resolved", label: "Resolved" }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  activeTab === tab.key
                    ? "bg-green-700 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sa-input pl-9 py-2 text-xs"
            />
          </div>
        </div>

        {/* ISSUES TABLE */}
        <div className="sa-card p-0 overflow-x-auto">
          <table className="w-full sa-table text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Tracking ID</th>
                <th className="py-3 px-4">Title & Area</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Reported By</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">Loading incident queue...</td>
                </tr>
              ) : filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">No issues found in this tab.</td>
                </tr>
              ) : (
                filteredIssues.map((it) => (
                  <tr key={it.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-4 px-4 font-mono font-bold text-green-700">
                      {it.tracking_id}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">{it.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <MapPin size={12} /> {it.area || it.landmark || "Varanasi Ward"}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`text-xs font-bold px-2 py-0.5 ${it.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                        {it.priority}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-gray-600">
                      <div>{it.reporter_name}</div>
                      <div className="text-gray-400">{it.reporter_phone}</div>
                    </td>

                    <td className="py-4 px-4">
                      {getStatusBadge(it.status)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => openActionModal(it)}
                        className="sa-btn px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Eye size={14} /> Review & Action
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ACTION & TRIAGE MODAL */}
        {selected && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-300 p-6 sm:p-8 relative">
              <button
                onClick={() => setSelected(null)}
                className="absolute right-5 top-5 text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5 border border-green-200 text-xs">
                  {selected.tracking_id}
                </span>
                {getStatusBadge(selected.status)}
                <span className={`text-xs font-bold px-2 py-0.5 ${selected.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                  {selected.priority} Priority
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">{selected.title}</h2>
              <p className="text-xs text-gray-600 mb-6">{selected.description}</p>

              {/* Photo & Audio Evidence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {selected.image_url ? (
                  <div className="border border-gray-200 p-2 bg-gray-50">
                    <span className="text-[11px] text-gray-500 font-semibold block mb-1">Attached Photo Evidence</span>
                    <img
                      src={selected.image_url.startsWith('http') ? selected.image_url : `${API_BASE_URL}${selected.image_url}`}
                      alt="Proof"
                      className="w-full h-36 object-cover border border-gray-200"
                    />
                  </div>
                ) : (
                  <div className="border border-gray-200 p-4 bg-gray-50 text-center text-xs text-gray-400 flex items-center justify-center">
                    No photo uploaded
                  </div>
                )}

                <div className="border border-gray-200 p-4 bg-gray-50 text-xs space-y-2">
                  <span className="text-[11px] text-gray-500 font-semibold block mb-1">Citizen & Location Profile</span>
                  <p><strong>Reporter:</strong> {selected.reporter_name}</p>
                  <p><strong>Phone:</strong> {selected.reporter_phone}</p>
                  <p><strong>Area:</strong> {selected.area}</p>
                  <p><strong>Landmark:</strong> {selected.landmark}</p>
                  {selected.audio_url && (
                    <div className="pt-2 border-t border-gray-200 mt-2">
                      <span className="font-semibold block mb-1">Voice Recording:</span>
                      <audio controls src={selected.audio_url.startsWith('http') ? selected.audio_url : `${API_BASE_URL}${selected.audio_url}`} className="w-full h-8" />
                    </div>
                  )}
                </div>
              </div>

              {/* AI INTELLIGENCE SUMMARY */}
              {selected.ai_analysis && (
                <div className="bg-green-50 border border-green-200 p-3 text-xs text-green-900 mb-6">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Sparkles size={14} className="text-green-700" /> AI Classification Diagnostics
                  </div>
                  <p className="text-[11px] text-gray-700">{selected.ai_analysis}</p>
                </div>
              )}

              {/* DEPARTMENT ACTION CONTROLS */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                  Operational Workflow Actions
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Assign Field Squad / Engineer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sanitary Inspector Sunil Kumar, Squad 4"
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className="sa-input py-2 text-xs"
                  />
                </div>

                {/* Reject Reason input if rejecting */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Rejection / Dismissal Notes (Required if rejecting)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Duplicate report already being resolved by Squad B"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="sa-input py-2 text-xs"
                  />
                </div>

                {/* ACTION BUTTONS GROUP */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus("accepted")}
                    className="sa-btn text-xs py-2.5 justify-center bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Check size={14} /> Accept Task
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus("in-progress")}
                    className="sa-btn text-xs py-2.5 justify-center bg-blue-600 hover:bg-blue-700"
                  >
                    <Clock size={14} /> Mark Active
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus("resolved")}
                    className="sa-btn text-xs py-2.5 justify-center bg-green-700 hover:bg-green-800"
                  >
                    <CheckCircle2 size={14} /> Resolve & Close
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus("rejected")}
                    className="sa-btn text-xs py-2.5 justify-center bg-red-600 hover:bg-red-700"
                  >
                    <XCircle size={14} /> Reject Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DeptAdminLayout>
  );
}
