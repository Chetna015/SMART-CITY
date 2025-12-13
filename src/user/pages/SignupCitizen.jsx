import Navbar from "../../components/Navbar";

export default function SignupCitizen() {
  return (
    <>
      <Navbar />

      <div className="form-box">
        <h2 className="text-2xl font-semibold text-primary text-center mb-4">
          Register as Citizen
        </h2>

        <label className="text-secondary font-medium">Full Name</label>
        <input className="input" type="text" />

        <label className="text-secondary font-medium">Username</label>
        <input className="input" type="text" />

        <label className="text-secondary font-medium">Email (optional)</label>
        <input className="input" type="email" />

        <label className="text-secondary font-medium">Create Password</label>
        <input className="input" type="password" />

        <label className="text-secondary font-medium">Retype Password</label>
        <input className="input" type="password" />

        <label className="text-secondary font-medium">Full Address</label>
        <textarea className="input h-24"></textarea>

        <button className="btn mt-2">Create Account</button>

        <p className="text-center mt-4 text-secondary">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Login here
          </a>
        </p>
      </div>
    </>
  );
}
