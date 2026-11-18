import { useState, useEffect } from "react";
import { Search, Plus, MapPin, Phone, Mail, Building } from "lucide-react";
import DeptAdminLayout from "../components/DeptAdminLayout";
import { getDepartments, createDepartment } from "../../../services/api";

export default function DeptDepartments() {
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newDept, setNewDept] = useState({
    name: "",
    head: "",
    phone: "",
    zone: "",
    sla_hours: 24
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getDepartments();
      if (res.success) setDepartments(res.departments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddDepartment(e) {
    e.preventDefault();
    try {
      const res = await createDepartment(newDept);
      if (res.success) {
        setShowAdd(false);
        setNewDept({ name: "", head: "", phone: "", zone: "", sla_hours: 24 });
        loadData();
      }
    } catch (err) {
      alert("Error adding sub-department");
    }
  }

  const visible = departments.filter((d) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      d.name.toLowerCase().includes(q) ||
      (d.head && d.head.toLowerCase().includes(q)) ||
      (d.zone && d.zone.toLowerCase().includes(q))
    );
  });

  return (
    <DeptAdminLayout>
      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Department Directory & Zones</h1>
            <p className="text-sm text-gray-500 mt-1">
              Internal municipal divisions, jurisdictional zones, and emergency dispatch points.
            </p>
          </div>

          <button
            onClick={() => setShowAdd(!showAdd)}
            className="sa-btn px-4 py-2 font-semibold flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus size={16} /> {showAdd ? "Cancel" : "Add Division"}
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, zone, or officer in charge..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="sa-input pl-9 py-2 text-xs"
          />
        </div>

        {/* ADD DIVISION MODAL */}
        {showAdd && (
          <div className="sa-card p-6 border-2 border-green-600 max-w-xl animate-fadeIn">
            <h3 className="font-bold text-gray-900 text-base mb-4">Register New Division / Zone</h3>
            <form onSubmit={handleAddDepartment} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Division Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Night Sanitation Flying Squad"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="sa-input py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Officer In Charge</label>
                  <input
                    type="text"
                    required
                    placeholder="Officer Name"
                    value={newDept.head}
                    onChange={(e) => setNewDept({ ...newDept, head: e.target.value })}
                    className="sa-input py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Assigned Zone</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zone A (Sigra)"
                    value={newDept.zone}
                    onChange={(e) => setNewDept({ ...newDept, zone: e.target.value })}
                    className="sa-input py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Direct Line</label>
                  <input
                    type="text"
                    required
                    placeholder="+91..."
                    value={newDept.phone}
                    onChange={(e) => setNewDept({ ...newDept, phone: e.target.value })}
                    className="sa-input py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Resolution SLA (Hours)</label>
                  <input
                    type="number"
                    required
                    value={newDept.sla_hours}
                    onChange={(e) => setNewDept({ ...newDept, sla_hours: Number(e.target.value) })}
                    className="sa-input py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="sa-btn secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="sa-btn text-xs font-semibold">
                  Save Division
                </button>
              </div>
            </form>
          </div>
        )}

        {/* DIRECTORY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-gray-400 py-8">Loading directory...</p>
          ) : visible.length === 0 ? (
            <p className="text-gray-400 py-8">No divisions matched your search.</p>
          ) : (
            visible.map((dept) => (
              <div key={dept.id} className="sa-card p-5 border border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 border border-green-200">
                      SLA: {dept.sla_hours || 24}h
                    </span>
                    <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5">
                      OPERATIONAL
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base mb-1">{dept.name}</h3>
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                    <MapPin size={12} /> {dept.zone || "Varanasi Ward Zone"}
                  </p>

                  <div className="text-xs text-gray-600 space-y-1 border-t border-gray-100 pt-3">
                    <p><strong>Head:</strong> {dept.head || "Appointed Officer"}</p>
                    <p><strong>Phone:</strong> {dept.phone}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Status:</span>
                  <span className="font-semibold text-green-700">Active Duty</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DeptAdminLayout>
  );
}
