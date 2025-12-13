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

  // STATUS → PROGRESS COLOR + WIDTH
  const getProgress = (status) => {
    switch (status) {
      case "Pending":
        return { width: "30%", color: "bg-yellow-500" };
      case "In-Progress":
        return { width: "60%", color: "bg-blue-500" };
      case "Resolved":
        return { width: "100%", color: "bg-green-600" };
      default:
        return { width: "0%", color: "" };
    }
  };

  return (
    <SuperAdminLayout>
      <div className="p-10">
        <h1 className="text-4xl font-bold mb-8">Issue Management</h1>

        <div className="bg-white p-8 rounded-xl shadow border w-[95%]">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left font-semibold">
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
                  <tr key={item.id} className="border-b">
                    <td className="py-4">{item.title}</td>
                    <td>{item.department}</td>
                    <td>{item.reportedBy}</td>
                    <td>{item.date}</td>

                    {/* PROGRESS BAR */}
                    <td>
                      <div className="w-40 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`${progress.color} h-3`}
                          style={{ width: progress.width }}
                        ></div>
                      </div>

                      <span className="text-sm text-gray-700 ml-1">
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
