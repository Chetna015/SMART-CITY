import IssueTrackRow from "../components/IssueTrackRow";

export default function TrackIssues() {
  const issues = [
    {
      id: 1,
      title: "Overflowing garbage bin",
      description: "Garbage has been overflowing for 3 days.",
      location: "MG Road & Brigade Road",
      date: "15/01/2024",
      category: "garbage",
      status: "pending", // backend style
      image: "/images/garbage.jpg",
    },
    {
      id: 2,
      title: "Large pothhole on Commercial Street",
      description: "Deep pothole causing vehicle damage.",
      location: "123 Commercial Street",
      date: "12/01/2024",
      category: "pothole",
      status: "in-progress",
      image: "/images/pothole.jpg",
    },
    {
      id: 3,
      title: "Street light not working",
      description: "Street light has been off for a week.",
      location: "Jyoti Niwas College",
      date: "08/01/2024",
      category: "streetlight",
      status: "resolved",
      image: "/images/light.jpg",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Track Issues</h1>

      {issues.map((item) => (
        <IssueTrackRow key={item.id} issue={item} />
      ))}
    </div>
  );
}
