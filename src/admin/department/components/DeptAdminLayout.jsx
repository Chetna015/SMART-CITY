import DeptAdminNavbar from "./DeptAdminNavbar";
import DeptAdminSidebar from "./DeptAdminSidebar";

export default function DeptAdminLayout({ children }) {
  return (
    <div className="flex">
      <div className="fixed left-0 top-0 h-screen w-64">
        <DeptAdminSidebar />
      </div>

      <div className="fixed left-64 right-0 top-0 z-40">
        <DeptAdminNavbar />
      </div>

      <div className="ml-64 flex-1 min-h-screen main-with-navbar bg-[var(--background)]">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
