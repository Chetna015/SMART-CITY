export default function SuperAdminStatCard({ title, value }) {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg border border-borderCol w-48">
      <p className="text-secondary">{title}</p>
      <h2 className="text-3xl font-bold text-primary">{value}</h2>
    </div>
  );
}
