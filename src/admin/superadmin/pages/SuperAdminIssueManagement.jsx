import SuperAdminLayout from "../components/SuperAdminLayout";

export default function SuperAdminIssueManagement() {
  const issues = [
    {
      id: 1,
      title: "Overflowing garbage bin",
      department: "Garbage",
      reportedBy: "Ravi Kumar",
      date: "2025-01-12",
      status: "Pending",
    },
    {
      id: 2,
      title: "Street light not working",
      department: "Street Lights",
      reportedBy: "Suman Singh",
      date: "2025-01-10",
      status: "Resolved",
    },
    {
      id: 3,
      title: "Large pothole",
      department: "Pothole",
      reportedBy: "Ankit Verma",
      date: "2025-01-09",
      status: "In-Progress",
    },
  ];

  // STATUS → PROGRESS COLOR + WIDTH (use hex colors for inline styles)
  const getProgress = (status) => {
    switch (status) {
      case "Pending":
        return { width: "30%", color: "#f59e0b" };
      case "In-Progress":
        return { width: "60%", color: "var(--primary-blue)" };
      case "Resolved":
        return { width: "100%", color: "#28a745" };
      default:
        return { width: "0%", color: "transparent" };
    }
  };

  return (
    <SuperAdminLayout>
      <div className="p-10">
        <h1 className="text-4xl font-bold mb-8">Issue Management</h1>

        <div className="sa-card w-[95%]">
          <table className="w-full sa-table">
            <thead>
              <tr className="text-left font-semibold">
                <th className="py-3">Issue</th>
                <th>Department</th>
                <th>Reported By</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {issues.map((item) => {
                const progress = getProgress(item.status);

                return (
                  <tr key={item.id}>
                    <td className="py-4">{item.title}</td>
                    <td>{item.department}</td>
                    <td>{item.reportedBy}</td>
                    <td>{item.date}</td>

                    {/* PROGRESS BAR */}
                    <td>
                      <div className="sa-progress-outer">
                        <div
                          className="sa-progress-inner"
                          style={{
                            width: progress.width,
                            background: progress.color.replace("bg-", ""),
                          }}
                        ></div>
                      </div>

                      <span className="text-sm text-[var(--soft-text)] ml-1">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
