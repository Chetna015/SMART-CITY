import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginCitizen() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirect") || "/dashboard";

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

    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="sa-card w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[var(--text)] mb-6">
          Citizen Login
        </h2>

        {/* STEP 1 — ENTER MOBILE */}
        {step === 1 && (
          <div className="space-y-3">
            <label className="font-medium text-[var(--soft-text)]">
              Mobile Number
            </label>

            <input
              type="tel"
              className="sa-input max-w-sm py-2 mt-2"
              placeholder="Enter mobile number"
              maxLength="10"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <div className="flex justify-center mt-4">
              <button
                className="sa-btn mt-2 w-32 items-center"
                onClick={sendOtp}
              >
                Send OTP
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — ENTER OTP */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="font-medium text-[var(--soft-text)]">
              Enter OTP
            </label>
            <input
              type="text"
              className="sa-input"
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <div className="flex gap-3">
              <button className="sa-btn" onClick={verifyOtp}>
                Verify OTP
              </button>
              <button className="sa-btn secondary" onClick={sendOtp}>
                Resend OTP
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — ENTER NAME */}
        {step === 3 && (
          <div className="space-y-4">
            <label className="font-medium text-[var(--soft-text)]">
              Enter Your Name
            </label>
            <input
              type="text"
              className="sa-input"
              placeholder="Your full name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <button className="sa-btn w-full" onClick={completeLogin}>
              Continue to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
