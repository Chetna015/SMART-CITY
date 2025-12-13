import Navbar from "../../components/Navbar";

export default function LoginCitizen() {
  return (
    <>
      <Navbar />

      <div className="form-box">
        <h2 className="text-2xl font-semibold text-primary text-center mb-4">
          Login as Citizen
        </h2>

        <label className="text-secondary font-medium">
          Username or Mobile no.
        </label>
        <input type="text" className="input" placeholder="Enter username" />

        <label className="text-secondary font-medium">Password</label>
        <input type="password" className="input" placeholder="Enter password" />

        <button
          className="btn"
          onClick={() => {
            window.location.href = "/dashboard";
          }}
        >
          Sign In
        </button>

        <p className="text-center mt-4 text-secondary">
          Not registered yet?{" "}
          <a href="/signup" className="text-primary hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </>
  );
}
