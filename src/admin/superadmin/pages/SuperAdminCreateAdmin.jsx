import { useState } from "react";
import { UserPlus, Mail, Phone, Lock, Building, Plus } from "lucide-react";
import SuperAdminLayout from "../components/SuperAdminLayout";

export default function SuperAdminCreateAdmin() {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "",
  });

  const [admins, setAdmins] = useState([
    { name: "Ravi Kumar", email: "ravi@dept.com", department: "Garbage" },
    {
      name: "Suman Singh",
      email: "suman@dept.com",
      department: "Street Lights",
    },
  ]);

  const departments = [
    "Garbage",
    "Footpath",
    "Pothole",
    "Water Leak",
    "Traffic Signal",
    "Street Lights",
    "Sewage Leak",
    "Fallen Tree",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setAdmins([...admins, formData]);

    alert("Department Admin Registered!");

    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      department: "",
    });

    setShowForm(false);
  };

  return (
    <SuperAdminLayout>
      <div className="p-10">
        <div className="flex gap-40">
          <h1 className="text-4xl font-bold mb-8">Create Department Admin</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mb-8 px-5 py-3 bg-blue-600 flex items-center gap-2 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <Plus size={20} /> New Registration
          </button>
        </div>

        {/* BUTTON TO SHOW FORM */}

        {/* SHOW FORM WHEN CLICKED */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="border p-8 rounded-xl bg-white shadow w-[60%] mb-10"
          >
            {/* NAME */}
            <label className="block mb-2 font-medium">Full Name</label>
            <div className="flex items-center border p-3 rounded mb-4">
              <UserPlus className="w-5 h-5 mr-2 text-gray-600" />
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>

            {/* EMAIL */}
            <label className="block mb-2 font-medium">Email</label>
            <div className="flex items-center border p-3 rounded mb-4">
              <Mail className="w-5 h-5 mr-2 text-gray-600" />
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>

            {/* PHONE */}
            <label className="block mb-2 font-medium">Phone Number</label>
            <div className="flex items-center border p-3 rounded mb-4">
              <Phone className="w-5 h-5 mr-2 text-gray-600" />
              <input
                type="text"
                name="phone"
                placeholder="Enter phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>

            {/* PASSWORD */}
            <label className="block mb-2 font-medium">Password</label>
            <div className="flex items-center border p-3 rounded mb-4">
              <Lock className="w-5 h-5 mr-2 text-gray-600" />
              <input
                type="password"
                name="password"
                placeholder="Set login password"
                value={formData.password}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>

            {/* DEPARTMENT */}
            <label className="block mb-2 font-medium">Select Department</label>
            <div className="flex items-center border p-3 rounded mb-4">
              <Building className="w-5 h-5 mr-2 text-gray-600" />
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full outline-none"
                required
              >
                <option value="">Choose Department</option>
                {departments.map((dept, idx) => (
                  <option key={idx} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-3 hover:bg-blue-700 transition"
            >
              Register Admin
            </button>
          </form>
        )}

        {/* REGISTERED ADMINS TABLE */}
        <h2 className="text-2xl font-bold mb-4">
          Registered Department Admins
        </h2>

        <div className="border p-5 rounded-xl bg-white w-[80%]">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left font-semibold">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Department</th>
              </tr>
            </thead>

            <tbody>
              {admins.map((admin, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-3">{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
