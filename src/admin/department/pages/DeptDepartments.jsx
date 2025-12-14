import DeptAdminLayout from "../components/DeptAdminLayout";
import { useState } from "react";

export default function DeptDepartments() {
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Public Works",
      head: "Ramesh Kumar",
      phone: "+91 98765 43210",
      zone: "Zone A",
      active: true,
    },
    {
      id: 2,
      name: "Health & Sanitation",
      head: "Sonia Verma",
      phone: "+91 91234 56789",
      zone: "Zone B",
      active: true,
    },
  ]);

  const [newDept, setNewDept] = useState({
    name: "",
    head: "",
    phone: "",
    zone: "",
    active: true,
  });

  function addDepartment(e) {
    e.preventDefault();
    const id = Math.max(0, ...departments.map((d) => d.id)) + 1;
    setDepartments((p) => [...p, { ...newDept, id }]);
    setNewDept({ name: "", head: "", phone: "", zone: "", active: true });
    setShowAdd(false);
  }

  const visible = departments.filter((d) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      d.name.toLowerCase().includes(q) ||
      d.head.toLowerCase().includes(q) ||
      d.zone.toLowerCase().includes(q)
    );
  });

  return (
    <DeptAdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Departments</h1>
          <button onClick={() => setShowAdd(true)} className="sa-btn">
            Add Department
          </button>
        </div>

        <div className="sa-card p-4 border border-gray-200 rounded-none mb-4">
          <div className="flex gap-4 items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, head or zone"
              className="sa-input flex-1"
            />
            <div className="text-sm text-[var(--soft-text)]">
              {visible.length} results
            </div>
          </div>
        </div>

        <div className="sa-card p-0 border border-gray-200 rounded-none overflow-hidden">
          <table className="w-full sa-table">
            <thead>
              <tr className="text-left text-sm text-[var(--soft-text)]">
                <th className="py-3">Department</th>
                <th>Head</th>
                <th>Phone</th>
                <th>Zone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((d) => (
                <tr key={d.id}>
                  <td className="py-4 font-medium">{d.name}</td>
                  <td className="text-sm">{d.head}</td>
                  <td className="text-sm">{d.phone}</td>
                  <td className="text-sm">{d.zone}</td>
                  <td className="text-sm">
                    {d.active ? "Active" : "Inactive"}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="sa-btn px-3 py-1">View</button>
                      <button className="sa-btn px-3 py-1">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black opacity-30"
              onClick={() => setShowAdd(false)}
            ></div>
            <form
              onSubmit={addDepartment}
              className="relative bg-white w-[600px] max-w-[95%] p-6 rounded-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Add Department</h2>
                <button
                  onClick={() => setShowAdd(false)}
                  type="button"
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <input
                  value={newDept.name}
                  onChange={(e) =>
                    setNewDept({ ...newDept, name: e.target.value })
                  }
                  placeholder="Department name"
                  className="sa-input w-full"
                  required
                />
                <input
                  value={newDept.head}
                  onChange={(e) =>
                    setNewDept({ ...newDept, head: e.target.value })
                  }
                  placeholder="Head name"
                  className="sa-input w-full"
                />
                <input
                  value={newDept.phone}
                  onChange={(e) =>
                    setNewDept({ ...newDept, phone: e.target.value })
                  }
                  placeholder="Phone"
                  className="sa-input w-full"
                />
                <input
                  value={newDept.zone}
                  onChange={(e) =>
                    setNewDept({ ...newDept, zone: e.target.value })
                  }
                  placeholder="Zone/Area"
                  className="sa-input w-full"
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="sa-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="sa-btn"
                    style={{ background: "#16a34a", color: "white" }}
                  >
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </DeptAdminLayout>
  );
}
