import { useState, useEffect } from "react";
import { Search, Filter, Eye, X, Building2, MapPin, Calendar, Clock, Sparkles } from "lucide-react";
import SuperAdminLayout from "../components/SuperAdminLayout";
import { getIssues, getIssueById, getDepartments, API_BASE_URL } from "../../../services/api";

export default function SuperAdminIssueManagement() {
  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [timeline, setTimeline] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [issuesRes, deptsRes] = await Promise.all([
        getIssues({
          department_id: selectedDept !== 'all' ? selectedDept : undefined,
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
          search: search.trim()
        }),
        getDepartments()
      ]);

      if (issuesRes.success) {
        setIssues(issuesRes.issues || []);
      }
      if (deptsRes.success) {
        setDepartments(deptsRes.departments || []);
      }
    } catch (err) {
      console.error("SuperAdmin Issue load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDept, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const openDetailModal = async (issue) => {
    setSelectedIssue(issue);
    try {
      const res = await getIssueById(issue.id);
      if (res.success) {
        setSelectedIssue(res.issue);
        setTimeline(res.timeline || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getProgress = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { width: "25%", color: "#f59e0b" };
      case "accepted":
        return { width: "50%", color: "#6366f1" };
      case "in-progress":
        return { width: "75%", color: "#2563eb" };
      case "resolved":
        return { width: "100%", color: "#16a34a" };
      case "rejected":
        return { width: "100%", color: "#dc2626" };
      default:
        return { width: "10%", color: "#9ca3af" };
    }
  };

  return (
    <SuperAdminLayout>
      <div className="p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">City-Wide Issue Registry</h1>
            <p className="text-sm text-gray-500 mt-1">
              Centralized municipal complaints audit, SLA tracking, and status progression across all wards.
            </p>
          </div>
          <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 self-start sm:self-auto">
            Total Logged: {issues.length}
          </span>
        </div>

        {/* FILTERS BAR */}
        <div className="sa-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by Tracking ID, keyword, area..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="sa-input pl-10"
              />
            </div>
            <button type="submit" className="sa-btn px-4 py-2 text-sm">
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="sa-input py-2 text-sm max-w-[200px]"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="sa-input py-2 text-sm max-w-[140px]"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="in-progress">In-Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* ISSUES TABLE */}
        <div className="sa-card p-0 overflow-x-auto">
          <table className="w-full sa-table text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Issue Title & Ward</th>
                <th className="py-3 px-4">Assigned Department</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">SLA Progress</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">Loading issues...</td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">No issues match the selected filters.</td>
                </tr>
              ) : (
                issues.map((item) => {
                  const progress = getProgress(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-4 px-4 font-mono font-bold text-green-700">
                        {item.tracking_id}
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">{item.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <MapPin size={12} /> {item.area || item.location_address || "Varanasi"} • By {item.reporter_name}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs font-medium text-gray-700">
                        {item.department_name}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`text-xs font-bold px-2 py-0.5 ${item.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                          {item.priority}
                        </span>
                      </td>

                      <td className="py-4 px-4 min-w-[150px]">
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-1">
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: progress.width,
                              backgroundColor: progress.color
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold capitalize text-gray-600">
                          {item.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => openDetailModal(item)}
                          className="sa-btn px-3 py-1.5 text-xs font-medium inline-flex items-center gap-1"
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* DETAIL MODAL */}
        {selectedIssue && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl max-h-[85vh] overflow-y-auto border border-gray-300 p-6 sm:p-8 relative">
              <button
                onClick={() => setSelectedIssue(null)}
                className="absolute right-5 top-5 text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5 border border-green-200">
                  {selectedIssue.tracking_id}
                </span>
                <span className="text-xs font-bold uppercase text-gray-500">{selectedIssue.category}</span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-4">{selectedIssue.title}</h2>

              {selectedIssue.image_url && (
                <div className="mb-4">
                  <img
                    src={selectedIssue.image_url.startsWith('http') ? selectedIssue.image_url : `${API_BASE_URL}${selectedIssue.image_url}`}
                    alt="Proof"
                    className="w-full h-44 object-cover border border-gray-200"
                  />
                </div>
              )}

              <div className="bg-gray-50 p-4 border border-gray-200 space-y-2 text-xs text-gray-700 mb-6">
                <p><strong>Department:</strong> {selectedIssue.department_name}</p>
                <p><strong>Area / Mohalla:</strong> {selectedIssue.area} ({selectedIssue.landmark})</p>
                <p><strong>Reporter Contact:</strong> {selectedIssue.reporter_name} ({selectedIssue.reporter_phone})</p>
                <p><strong>Current Status:</strong> <span className="font-bold uppercase">{selectedIssue.status}</span></p>
                {selectedIssue.assigned_staff && <p><strong>Assigned Crew:</strong> {selectedIssue.assigned_staff}</p>}
                {selectedIssue.rejection_reason && <p className="text-red-600"><strong>Rejection Reason:</strong> {selectedIssue.rejection_reason}</p>}
                {selectedIssue.resolution_remarks && <p className="text-green-700"><strong>Resolution Remarks:</strong> {selectedIssue.resolution_remarks}</p>}
              </div>

              <div className="flex justify-end">
                <button onClick={() => setSelectedIssue(null)} className="sa-btn px-5 py-2 text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}
