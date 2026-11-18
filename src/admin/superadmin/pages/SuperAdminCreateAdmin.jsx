import { useState, useEffect } from "react";
import { UserPlus, Mail, Phone, Lock, Building, Plus, ShieldCheck, CheckCircle2 } from "lucide-react";
import SuperAdminLayout from "../components/SuperAdminLayout";
import { getAdmins, createAdmin, getDepartments } from "../../../services/api";

export default function SuperAdminCreateAdmin() {
  const [showForm, setShowForm] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: ""
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [adminsRes, deptsRes] = await Promise.all([
        getAdmins(),
        getDepartments()
      ]);

      if (adminsRes.success) setAdmins(adminsRes.admins || []);
      if (deptsRes.success) setDepartments(deptsRes.departments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createAdmin(formData);
      if (res.success) {
        setSuccessMsg(`Department administrator for ${formData.department || 'Department'} created successfully!`);
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          department: ""
        });
        setShowForm(false);
        loadData();
        setTimeout(() => setSuccessMsg(""), 5000);
      } else {
        alert(res.message || "Failed to create admin");
      }
    } catch (err) {
      alert("Error contacting server");
    }
  };

  return (
    <SuperAdminLayout>
      <div className="p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Department Administrators</h1>
            <p className="text-sm text-gray-500 mt-1">
              Provision departmental staff credentials, assign administrative roles, and manage zone access.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="sa-btn px-4 py-2.5 font-semibold flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus size={18} /> {showForm ? "Cancel Registration" : "Provision New Admin"}
          </button>
        </div>

        {successMsg && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-2">
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {/* REGISTRATION FORM */}
        {showForm && (
          <div className="sa-card p-6 sm:p-8 max-w-2xl bg-white border-2 border-green-600 shadow-md animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <UserPlus className="text-green-700" size={20} /> Register Department Administrator
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={handleChange}
                    className="sa-input pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Official Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="admin@dept.eco.in"
                      value={formData.email}
                      onChange={handleChange}
                      className="sa-input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="sa-input pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Assign Department</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 text-gray-400" size={16} />
                    <select
                      name="department"
                      required
                      value={formData.department}
                      onChange={handleChange}
                      className="sa-input pl-10 text-sm"
                    >
                      <option value="">Select Department...</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Initial Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      className="sa-input pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="sa-btn secondary px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sa-btn px-6 py-2 text-sm font-semibold"
                >
                  Save & Dispatch Credentials
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ADMINS TABLE */}
        <div className="sa-card p-0 overflow-x-auto">
          <table className="w-full sa-table text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Admin Name</th>
                <th className="py-3 px-4">Assigned Department</th>
                <th className="py-3 px-4">Contact Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Role Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">Loading administrators...</td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">No administrators provisioned yet.</td>
                </tr>
              ) : (
                admins.map((adm) => (
                  <tr key={adm.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-4 px-4 font-semibold text-gray-900">{adm.name}</td>
                    <td className="py-4 px-4 text-xs font-medium text-gray-700">
                      {adm.department || "City Authority"}
                    </td>
                    <td className="py-4 px-4 text-gray-500">{adm.email}</td>
                    <td className="py-4 px-4 text-gray-500">{adm.phone}</td>
                    <td className="py-4 px-4">
                      <span className={`text-[11px] font-bold px-2 py-0.5 uppercase ${adm.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {adm.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
