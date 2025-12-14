import SuperAdminNavbar from "./SuperAdminNavbar";
import SuperAdminSidebar from "./SuperAdminSidebar";

export default function SuperAdminLayout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar fixed left */}
      <div className="fixed left-0 top-0 h-screen w-64">
        <SuperAdminSidebar />
      </div>

      {/* Navbar fixed top (to the right of sidebar) */}
      <div className="fixed left-64 right-0 top-0 z-40">
        <SuperAdminNavbar />
      </div>

      {/* Main Content area; add top padding so content doesn't sit under navbar */}
      <div className="ml-64 flex-1 min-h-screen main-with-navbar bg-[var(--background)]">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
