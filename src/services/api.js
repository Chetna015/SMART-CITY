import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { KeyRound, User, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  sendOtp as sendOtpApi,
  verifyOtp as verifyOtpApi,
  completeProfile,
} from "../../services/api";

export default function LoginCitizen() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirect") || "/dashboard";

  const [step, setStep] = useState(1); // 1 = email, 2 = code, 3 = name (first time only)
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [profileToken, setProfileToken] = useState("");
  const [loading, setLoading] = useState(false);

  const cleanEmail = email.trim().toLowerCase();

  // The rest of the app identifies a citizen by "citizenPhone" (used as
  // reporter_phone on issues), so the verified email is stored under that key.
  const saveSession = (user) => {
    localStorage.setItem("citizenName", user.name);
    localStorage.setItem("citizenPhone", user.email || cleanEmail);
    localStorage.setItem("citizenEmail", user.email || cleanEmail);
    localStorage.setItem("userRole", "citizen");
    navigate(redirectTo);
  };

  // STEP 1: SEND CODE
  const sendOtp = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      alert("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await sendOtpApi(cleanEmail);
      if (!res.success) {
        alert(res.message || "Could not send the code.");
        return;
      }
      setInfoMsg(
        res.devOtp
          ? `Dev mode - your code is ${res.devOtp}`
          : `Code sent to ${cleanEmail}. Check your inbox (and spam).`
      );
      setOtp("");
      setStep(2);
    } catch {
      alert("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: VERIFY CODE
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      alert("Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtpApi(cleanEmail, otp);
      if (!res.success) {
        alert(res.message || "Verification failed.");
        return;
      }
      if (res.needsName) {
        setProfileToken(res.profileToken);
        setInfoMsg("");
        setStep(3);
      } else {
        saveSession(res.user);
      }
    } catch {
      alert("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: NEW USER ENTERS NAME
  const completeLogin = async () => {
    if (!username.trim()) {
      alert("Please enter your name");
      return;
    }
    setLoading(true);
    try {
      const res = await completeProfile(profileToken, username);
      if (!res.success) {
        alert(res.message || "Could not finish registration.");
        setStep(1);
        return;
      }
      saveSession(res.user);
    } catch {
      alert("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
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
            Sign In with Email Code
          </h2>
        </div>

        {infoMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} /> {infoMsg}
          </div>
        )}

        {/* STEP 1 — ENTER EMAIL */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="flex border border-gray-300 focus-within:border-green-700 bg-white shadow-sm transition-all">
                <span className="inline-flex items-center px-3.5 bg-gray-100 border-r border-gray-300 text-gray-500">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  className="flex-1 px-3 py-2.5 text-sm font-medium outline-none text-gray-900 bg-white"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                />
              </div>
            </div>

            <button
              className="w-full sa-btn py-3 justify-center text-sm font-bold shadow-sm"
              onClick={sendOtp}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Login Code"} <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2 — ENTER CODE */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Enter the 6-Digit Code Sent to {cleanEmail}
              </label>
              <div className="flex border border-gray-300 focus-within:border-green-700 bg-white shadow-sm transition-all">
                <span className="inline-flex items-center px-3.5 bg-gray-100 border-r border-gray-300 text-gray-500">
                  <KeyRound size={16} />
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  className="flex-1 px-3 py-2.5 text-center tracking-widest font-mono font-bold text-lg outline-none text-gray-900 bg-white"
                  placeholder="------"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="flex-1 sa-btn py-2.5 justify-center text-xs font-bold"
                onClick={verifyOtp}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
              <button
                className="sa-btn secondary text-xs py-2.5"
                onClick={sendOtp}
                disabled={loading}
              >
                Resend
              </button>
            </div>

            <button
              className="text-xs text-green-700 hover:underline font-semibold w-full text-center"
              onClick={() => {
                setStep(1);
                setInfoMsg("");
              }}
            >
              Use a different email
            </button>
          </div>
        )}

        {/* STEP 3 — ENTER CITIZEN NAME (new users only) */}
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
                  onKeyDown={(e) => e.key === "Enter" && completeLogin()}
                />
              </div>
            </div>

            <button
              className="w-full sa-btn py-3 justify-center text-sm font-bold shadow-sm"
              onClick={completeLogin}
              disabled={loading}
            >
              {loading ? "Saving..." : "Complete Registration & Proceed"} <ArrowRight size={16} />
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
