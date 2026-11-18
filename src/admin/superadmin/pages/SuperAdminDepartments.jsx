import { useState, useEffect } from "react";
import { Building2, Plus, Phone, Mail, MapPin, CheckCircle, Clock } from "lucide-react";
import SuperAdminLayout from "../components/SuperAdminLayout";
import { getDepartments, createDepartment } from "../../../services/api";

export default function SuperAdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category_key: "general",
    head: "",
    phone: "",
    email: "",
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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createDepartment(form);
      if (res.success) {
        setShowAdd(false);
        setForm({ name: "", category_key: "general", head: "", phone: "", email: "", zone: "", sla_hours: 24 });
        loadData();
      }
    } catch (err) {
      alert("Error adding department");
    }
  };

  return (
    <SuperAdminLayout>
      <div className="p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Municipal Departments</h1>
            <p className="text-sm text-gray-500 mt-1">
              Configure city departments, responsible heads, jurisdiction zones, and response SLAs.
            </p>
          </div>

          <button
            onClick={() => setShowAdd(!showAdd)}
            className="sa-btn px-4 py-2.5 font-semibold flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus size={18} /> Add Department
          </button>
        </div>

        {/* ADD MODAL */}
        {showAdd && (
          <div className="sa-card p-6 border-2 border-green-600 max-w-xl animate-fadeIn">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Create Municipal Department</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bridges & Flyovers Division"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="sa-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Department Head</label>
                  <input
                    type="text"
                    required
                    placeholder="Head Officer Name"
                    value={form.head}
                    onChange={(e) => setForm({ ...form, head: e.target.value })}
                    className="sa-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Jurisdiction Zone</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zone D - Bhelupur"
                    value={form.zone}
                    onChange={(e) => setForm({ ...form, zone: e.target.value })}
                    className="sa-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="sa-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">SLA Resolution Hours</label>
                  <input
                    type="number"
                    required
                    value={form.sla_hours}
                    onChange={(e) => setForm({ ...form, sla_hours: Number(e.target.value) })}
                    className="sa-input"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="sa-btn secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="sa-btn text-xs font-semibold">
                  Save Department
                </button>
              </div>
            </form>
          </div>
        )}

        {/* DEPARTMENTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-gray-400 py-8">Loading departments...</p>
          ) : (
            departments.map((d) => (
              <div key={d.id} className="sa-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 border border-green-200">
                      SLA: {d.sla_hours}h
                    </span>
                    <span className="text-[11px] font-bold text-green-800 bg-green-100 px-2 py-0.5">
                      ACTIVE
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mb-1">{d.name}</h3>
                  <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                    <MapPin size={12} /> {d.zone || "City Central"}
                  </p>

                  <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3">
                    <p><strong>Head:</strong> {d.head || "Appointed Officer"}</p>
                    <p><strong>Helpline:</strong> {d.phone}</p>
                    <p><strong>Email:</strong> {d.email || "support@eco.gov.in"}</p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Live Workload:</span>
                  <div className="flex gap-2">
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 font-bold">
                      {d.pendingIssues || 0} Pending
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 font-bold">
                      {d.resolvedIssues || 0} Resolved
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
