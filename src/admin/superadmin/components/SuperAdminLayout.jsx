import SuperAdminNavbar from "./SuperAdminNavbar";
import SuperAdminSidebar from "./SuperAdminSidebar";

export default function SuperAdminLayout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen">
        <SuperAdminSidebar />
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 bg-gray-50 min-h-screen">
        <SuperAdminNavbar />

        <div className="p-8 mt-16">{children}</div>
      </div>
    </div>
  );
}
