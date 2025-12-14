import DeptAdminLayout from "../components/DeptAdminLayout";

export default function DeptSettings() {
  return (
    <DeptAdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>
        <div className="sa-card p-4 border border-gray-200 rounded-none">
          <p className="text-sm text-[var(--soft-text)]">
            Department settings and preferences.
          </p>
        </div>
      </div>
    </DeptAdminLayout>
  );
}
