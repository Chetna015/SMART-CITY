import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Filter, MapPin, Clock, CheckCircle2, AlertCircle, 
  ChevronRight, ArrowLeft, X, Sparkles, Building2, User 
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getIssues, getIssueById, API_BASE_URL } from "../../services/api";

export default function TrackIssues() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("citizenName");
    if (!user) {
      navigate("/login?redirect=/track");
    }
  }, [navigate]);

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Selected issue detail modal
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchIssuesList = async () => {
    setLoading(true);
    try {
      const res = await getIssues({
        status: statusFilter,
        category: categoryFilter,
        search: search.trim()
      });
      if (res.success && res.issues) {
        setIssues(res.issues);
      }
    } catch (err) {
      console.error("Error fetching issues:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuesList();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchIssuesList();
  };

  const openIssueDetails = async (issue) => {
    setSelectedIssue(issue);
    setLoadingDetail(true);
    try {
      const res = await getIssueById(issue.id);
      if (res.success) {
        setSelectedIssue(res.issue);
        setTimeline(res.timeline || []);
      }
    } catch (err) {
      console.error("Detail error:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return <span className="bg-green-100 text-green-800 text-xs px-3 py-1 font-semibold uppercase">Resolved</span>;
      case "in-progress":
        return <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 font-semibold uppercase">In Progress</span>;
      case "accepted":
        return <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 font-semibold uppercase">Accepted</span>;
      case "rejected":
        return <span className="bg-red-100 text-red-800 text-xs px-3 py-1 font-semibold uppercase">Rejected</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 font-semibold uppercase">Pending</span>;
    }
  };

  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Track Civic Issues</h1>
          <p className="text-gray-600 mt-1">
            Real-time public tracker for all civic complaints submitted across Varanasi wards.
          </p>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white border border-gray-200 p-4 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by Tracking ID (e.g. ECO-2401), area, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="sa-input pl-10 w-full"
              />
            </div>
            <button type="submit" className="sa-btn px-5 py-2.5">
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter size={16} /> Status:
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="sa-input py-2 text-sm max-w-[140px]"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="sa-input py-2 text-sm max-w-[140px]"
            >
              <option value="all">All Categories</option>
              <option value="garbage">Garbage</option>
              <option value="pothole">Pothole</option>
              <option value="streetlight">Streetlight</option>
              <option value="water_leak">Water Leak</option>
              <option value="sewage">Sewage</option>
              <option value="traffic_signal">Traffic Signal</option>
              <option value="tree">Fallen Tree</option>
            </select>
          </div>
        </div>

        {/* ISSUES LIST */}
        {loading ? (
          <div className="text-center py-16 bg-white border border-gray-200">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent mb-3"></div>
            <p className="text-gray-500 font-medium">Fetching real-time civic issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-200">
            <AlertCircle size={40} className="mx-auto text-gray-400 mb-2" />
            <h3 className="font-bold text-gray-800 text-lg">No reports found matching your criteria</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting the filters or search term.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((item) => (
              <div
                key={item.id}
                onClick={() => openIssueDetails(item)}
                className="bg-white border border-gray-200 p-5 shadow-sm hover:border-green-600 cursor-pointer transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Image Thumbnail */}
                  <div className="w-16 h-16 bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url.startsWith('http') ? item.image_url : `${API_BASE_URL}${item.image_url}`}
                        alt="Issue"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">📋</span>
                    )}
                  </div>

                  {/* Main Details */}
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5 border border-green-200">
                        {item.tracking_id}
                      </span>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 ${item.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                        {item.priority} Urgency
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base">
                      {item.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-gray-400" /> {item.area || item.location_address || "Varanasi"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 size={14} className="text-gray-400" /> {item.department_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-gray-400" /> {item.created_at}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side Status & View Action */}
                <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                  {getStatusBadge(item.status)}
                  <span className="text-xs font-semibold text-green-700 flex items-center gap-1">
                    Details <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ISSUE DETAIL MODAL / DRAWER */}
        {selectedIssue && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-300 shadow-2xl p-6 sm:p-8 relative">
              <button
                onClick={() => setSelectedIssue(null)}
                className="absolute right-6 top-6 text-gray-400 hover:text-gray-700"
              >
                <X size={22} />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono font-bold text-green-700 bg-green-50 px-2.5 py-1 border border-green-200">
                  {selectedIssue.tracking_id}
                </span>
                {getStatusBadge(selectedIssue.status)}
                <span className={`text-xs font-bold px-2 py-0.5 ${selectedIssue.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                  {selectedIssue.priority} Priority
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4">
                {selectedIssue.title}
              </h2>

              {/* Photo & Audio Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {selectedIssue.image_url && (
                  <div className="border border-gray-200 p-2 bg-gray-50">
                    <span className="text-xs text-gray-500 font-medium block mb-1">Attached Photo Evidence</span>
                    <img
                      src={selectedIssue.image_url.startsWith('http') ? selectedIssue.image_url : `${API_BASE_URL}${selectedIssue.image_url}`}
                      alt="Proof"
                      className="w-full h-44 object-cover border border-gray-200"
                    />
                  </div>
                )}

                <div className="border border-gray-200 p-4 bg-gray-50 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-gray-500 font-medium block mb-2">Assigned Municipal Unit</span>
                    <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <Building2 size={16} className="text-green-700" /> {selectedIssue.department_name}
                    </p>

                    <div className="mt-3 text-xs text-gray-600 space-y-1">
                      <p><strong>Ward / Area:</strong> {selectedIssue.area}</p>
                      <p><strong>Landmark:</strong> {selectedIssue.landmark}</p>
                      <p><strong>Coordinates:</strong> {selectedIssue.lat}, {selectedIssue.lng}</p>
                    </div>
                  </div>

                  {selectedIssue.audio_url && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-600 font-medium block mb-1">Voice Recording Note</span>
                      <audio
                        controls
                        src={selectedIssue.audio_url.startsWith('http') ? selectedIssue.audio_url : `${API_BASE_URL}${selectedIssue.audio_url}`}
                        className="w-full h-9"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* AI Analysis Summary Box */}
              {selectedIssue.ai_analysis && (
                <div className="bg-green-50/70 border border-green-200 p-4 mb-6">
                  <div className="flex items-center gap-2 text-green-800 font-semibold text-xs mb-1 uppercase tracking-wider">
                    <Sparkles size={14} /> AI Processing & Intelligence Log
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {selectedIssue.ai_analysis}
                  </p>
                </div>
              )}

              {/* Audit Timeline */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4">
                  Resolution Progress History
                </h4>

                {timeline.length === 0 ? (
                  <p className="text-xs text-gray-500">Awaiting status transitions from department staff.</p>
                ) : (
                  <div className="space-y-4 border-l-2 border-green-600 ml-2 pl-4">
                    {timeline.map((log) => (
                      <div key={log.id} className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-green-600 rounded-full border-2 border-white"></div>
                        <span className="text-xs font-bold text-gray-900 block">{log.action}</span>
                        <p className="text-xs text-gray-600 mt-0.5">{log.notes}</p>
                        <span className="text-[10px] text-gray-400 block mt-1">
                          Actor: {log.actor} | {log.created_at}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="sa-btn px-6 py-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
