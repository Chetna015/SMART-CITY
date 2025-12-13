import Navbar from "../../components/Navbar";

export default function TrackIssues() {
  return (
    <>
      <Navbar />

      <h2 className="text-2xl text-primary font-semibold text-center mt-6">
        Your Issue Status
      </h2>

      <div className="max-w-xl mx-auto mt-6 space-y-6">
        <div className="bg-white p-4 shadow-card rounded-lg border border-borderCol flex justify-between text-secondary font-medium">
          <span>Reported</span>
          <span>Accepted</span>
          <span>In progress</span>
          <span>Resolved</span>
        </div>

        <div className="bg-white p-4 shadow-card rounded-lg border border-borderCol flex justify-between text-secondary font-medium">
          <span>Reported</span>
          <span>Accepted</span>
          <span>In progress</span>
          <span>Resolved</span>
        </div>
      </div>
    </>
  );
}
