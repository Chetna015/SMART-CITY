import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginCitizen() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = mobile, 2 = OTP, 3 = username
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");

  // STEP 1: SEND OTP
  const sendOtp = () => {
    if (mobile.length !== 10) {
      alert("Enter valid 10-digit mobile number");
      return;
    }

    alert("OTP sent successfully! (backend integrate later)");
    setStep(2);
  };

  // STEP 2: VERIFY OTP
  const verifyOtp = () => {
    setStep(3);
  };

  // STEP 3: SET USERNAME & LOGIN
  const completeLogin = () => {
    if (!username.trim()) {
      alert("Please enter your name");
      return;
    }

    // save username in localStorage (later replace with backend)
    localStorage.setItem("citizenName", username);

    alert("Login Success! Redirecting…");

    navigate("/dashboard");
  };

  return (
    <div className="form-box">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">
        Citizen Login
      </h2>

      {/* STEP 1 — ENTER MOBILE */}
      {step === 1 && (
        <>
          <label className="font-medium">Mobile Number</label>
          <input
            type="tel"
            className="input"
            placeholder="Enter mobile number"
            maxLength="10"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <button className="btn mt-2" onClick={sendOtp}>
            Send OTP
          </button>
        </>
      )}

      {/* STEP 2 — ENTER OTP */}
      {step === 2 && (
        <>
          <label className="font-medium">Enter OTP</label>
          <input
            type="text"
            className="input"
            placeholder="Enter 6-digit OTP"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button className="btn mt-2" onClick={verifyOtp}>
            Verify OTP
          </button>

          <button className="btn-secondary mt-3" onClick={sendOtp}>
            Resend OTP
          </button>
        </>
      )}

      {/* STEP 3 — ENTER NAME */}
      {step === 3 && (
        <>
          <label className="font-medium">Enter Your Name</label>
          <input
            type="text"
            className="input"
            placeholder="Your full name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button className="btn mt-2" onClick={completeLogin}>
            Continue to Dashboard
          </button>
        </>
      )}
    </div>
  );
}
