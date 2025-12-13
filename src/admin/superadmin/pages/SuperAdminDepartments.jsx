import SuperAdminNavbar from "../components/SuperAdminNavbar";
import SuperAdminSidebar from "../components/SuperAdminSidebar";

import {
  TreePine,
  Footprints,
  Trash2,
  Construction,
  Lightbulb,
  TrafficCone,
  Droplets,
  Ban,
} from "lucide-react";

export default function SuperAdminDepartments() {
  const departments = [
    {
      name: "Fallen Tree",
      icon: <TreePine className="w-7 h-7 text-green-600" />,
    },
    {
      name: "Footpath",
      icon: <Footprints className="w-7 h-7 text-gray-700" />,
    },
    { name: "Garbage", icon: <Trash2 className="w-7 h-7 text-red-500" /> },
    {
      name: "Pothole",
      icon: <Construction className="w-7 h-7 text-yellow-600" />,
    },
    { name: "Sewage Leak", icon: <Ban className="w-7 h-7 text-blue-600" /> },
    {
      name: "Street Lights",
      icon: <Lightbulb className="w-7 h-7 text-orange-500" />,
    },
    {
      name: "Traffic Signal",
      icon: <TrafficCone className="w-7 h-7 text-red-600" />,
    },
    {
      name: "Water Leak",
      icon: <Droplets className="w-7 h-7 text-blue-500" />,
    },
  ];

  return (
    <div className="flex">
      <SuperAdminSidebar />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <SuperAdminNavbar />

        <div className="px-10 py-8">
          <h1 className="text-3xl font-semibold mb-6">Departments</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="bg-white shadow-sm border rounded-xl p-6 flex items-center gap-4 hover:shadow-md transition cursor-pointer"
              >
                {dept.icon}
                <span className="text-lg font-medium">{dept.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
