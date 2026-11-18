import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Phone, KeyRound, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { loginUser } from "../../services/api";

export default function LoginCitizen() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirect") || "/dashboard";

  const [step, setStep] = useState(1); // 1 = mobile, 2 = OTP, 3 = username
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  // STEP 1: SEND OTP
  const sendOtp = () => {
    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setInfoMsg("OTP 123456 generated & dispatched to +91 " + mobile);
    setStep(2);
  };

  // STEP 2: VERIFY OTP
  const verifyOtp = () => {
    if (!otp || otp.length < 4) {
      alert("Please enter a valid OTP (e.g. 123456).");
      return;
    }
    setStep(3);
  };

  // STEP 3: COMPLETE CITIZEN LOGIN
  const completeLogin = async () => {
    if (!username.trim()) {
      alert("Please enter your name");
      return;
    }

    try {
      await loginUser({ phone: mobile, username });
    } catch (err) {
      console.warn("Backend auth sync warning:", err);
    }

    localStorage.setItem("citizenName", username);
    localStorage.setItem("citizenPhone", mobile);
    localStorage.setItem("userRole", "citizen");

    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="sa-card w-full max-w-md bg-white border border-gray-200 shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-700 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow">
            <span className="text-xl">🌿</span>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-green-700 uppercase bg-green-50 px-2 py-0.5 border border-green-200">
            Citizen Access
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 mt-2">
            Sign In with Mobile OTP
          </h2>
        </div>

        {infoMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} /> {infoMsg}
          </div>
        )}

        {/* STEP 1 — ENTER MOBILE */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mobile Number (10 Digits)
              </label>
              <div className="flex border border-gray-300 focus-within:border-green-700 bg-white shadow-sm transition-all">
                <span className="inline-flex items-center px-3.5 bg-gray-100 border-r border-gray-300 text-xs font-bold text-gray-700 select-none">
                  +91
                </span>
                <input
                  type="tel"
                  className="flex-1 px-3 py-2.5 text-sm font-medium outline-none text-gray-900 bg-white"
                  placeholder="Enter 10-digit number"
                  maxLength="10"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>

            <button
              className="w-full sa-btn py-3 justify-center text-sm font-bold shadow-sm"
              onClick={sendOtp}
            >
              Generate OTP Code <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2 — ENTER OTP */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Enter 6-Digit OTP Sent to +91 {mobile}
              </label>
              <div className="flex border border-gray-300 focus-within:border-green-700 bg-white shadow-sm transition-all">
                <span className="inline-flex items-center px-3.5 bg-gray-100 border-r border-gray-300 text-gray-500">
                  <KeyRound size={16} />
                </span>
                <input
                  type="text"
                  className="flex-1 px-3 py-2.5 text-center tracking-widest font-mono font-bold text-lg outline-none text-gray-900 bg-white"
                  placeholder="123456"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1 text-center">
                (Demo OTP code: <code className="text-green-700">123456</code>)
              </p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 sa-btn py-2.5 justify-center text-xs font-bold" onClick={verifyOtp}>
                Verify OTP
              </button>
              <button className="sa-btn secondary text-xs py-2.5" onClick={sendOtp}>
                Resend
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — ENTER CITIZEN NAME */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Citizen Full Name
              </label>
              <div className="flex border border-gray-300 focus-within:border-green-700 bg-white shadow-sm transition-all">
                <span className="inline-flex items-center px-3.5 bg-gray-100 border-r border-gray-300 text-gray-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  className="flex-1 px-3 py-2.5 text-sm font-medium outline-none text-gray-900 bg-white"
                  placeholder="Enter your full name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <button
              className="w-full sa-btn py-3 justify-center text-sm font-bold shadow-sm"
              onClick={completeLogin}
            >
              Complete Registration & Proceed <ArrowRight size={16} />
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link to="/" className="text-xs text-green-700 hover:underline font-semibold">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
