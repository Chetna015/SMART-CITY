import Navbar from "../../components/Navbar";

export default function ReportIssue() {
  return (
    <>
      <Navbar />

      <div className="form-box">
        <h2 className="text-2xl font-semibold text-primary text-center mb-4">
          Report an Issue
        </h2>

        <label className="text-secondary font-medium">Upload Image</label>
        <div className="border-2 border-dashed border-primary rounded-lg p-6 text-center cursor-pointer hover:bg-accent transition">
          Drop your file here
        </div>

        <label className="text-secondary font-medium mt-4">Location</label>
        <input type="text" className="input" placeholder="Enter location" />

        <label className="text-secondary font-medium">Description</label>
        <textarea
          className="input h-24"
          placeholder="Describe the issue"
        ></textarea>

        <button className="btn mt-4">Submit Report</button>
      </div>
    </>
  );
}
