export default function IssueTrackRow({ issue }) {
  const steps = ["reported", "accepted", "in-progress", "resolved"];

  const normalize = (st) => (st === "pending" ? "reported" : st);
  const current = steps.indexOf(normalize(issue.status));

  const percent = (current / (steps.length - 1)) * 100;

  const categoryColor = {
    garbage: "bg-[rgb(255,230,200)] text-orange-700",
    pothole: "bg-[rgb(200,220,255)] text-blue-700",
    streetlight: "bg-[rgb(255,250,200)] text-yellow-700",
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm mb-6">
      {/* Top info */}
      <div className="flex justify-between">
        <div className="flex gap-4">
          <img
            src={issue.image}
            alt=""
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold">{issue.title}</h2>
            <p className="text-gray-600 text-sm">{issue.description}</p>
            <p className="text-gray-500 text-sm mt-1">
              📍 {issue.location} • {issue.date}
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
            categoryColor[issue.category]
          }`}
        >
          {issue.category}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        {/* LINE */}
        <div className="w-full bg-gray-300 rounded-full h-[6px]">
          <div
            className="bg-green-600 h-[6px] rounded-full"
            style={{ width: `${percent}%` }}
          ></div>
        </div>

        {/* DOTS */}
        <div className="flex justify-between mt-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 ${
                i <= current
                  ? "bg-green-600 border-green-600"
                  : "bg-white border-gray-400"
              }`}
            ></div>
          ))}
        </div>

        {/* LABELS */}
        <div className="flex justify-between mt-2 text-xs text-gray-700">
          <span>Reported</span>
          <span>Accepted</span>
          <span>In Progress</span>
          <span>Resolved</span>
        </div>
      </div>
    </div>
  );
}
