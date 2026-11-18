import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Camera, Mic, Square, MapPin, Sparkles, CheckCircle2, 
  AlertTriangle, ShieldCheck, ArrowRight, Loader2, RefreshCw 
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { reportIssue, uploadVoiceNote, analyzeWithAI } from "../../services/api";

export default function ReportIssue() {
  const navigate = useNavigate();

  // Citizen info from session
  const [citizenName, setCitizenName] = useState("Citizen");
  const [citizenPhone, setCitizenPhone] = useState("9125900756");

  useEffect(() => {
    const user = localStorage.getItem("citizenName");
    if (!user) {
      navigate("/login?redirect=/report");
    } else {
      setCitizenName(user);
    }
  }, [navigate]);

  // Form Fields
  const [location, setLocation] = useState("");
  const [landmark, setLandmark] = useState("");
  const [area, setArea] = useState("");
  const [coords, setCoords] = useState({ lat: 25.3176, lng: 82.9739 });
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userUrgency, setUserUrgency] = useState("Medium");

  // Voice recording state
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // AI Processing State
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // ---------------- AUTO LOCATION DETECT ----------------
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocation("Lat: 25.3176, Lng: 82.9739 (Default Varanasi)");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocation(`Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`);
      },
      () => {
        setLocation("Lat: 25.3176, Lng: 82.9739 (Default)");
      }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  // ---------------- IMAGE UPLOAD ----------------
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // Trigger AI Analysis
      triggerAIAnalysis(description, file.name);
    }
  };

  // ---------------- VOICE RECORDING ----------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
        const voiceFile = new File([audioBlob], `voice_${Date.now()}.mp3`, { type: "audio/mp3" });
        setAudioURL(URL.createObjectURL(voiceFile));
        setAudioFile(voiceFile);

        try {
          await uploadVoiceNote(voiceFile);
        } catch (err) {
          console.warn("Audio background sync:", err);
        }

        // Auto trigger AI with voice context
        triggerAIAnalysis(description || "Voice recording attached by citizen");
      };

      recorder.start();
      setRecording(true);
    } catch {
      alert("Microphone access permission was denied or is not supported.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // ---------------- AI AUTO-CLASSIFICATION & PRIORITY ----------------
  const triggerAIAnalysis = async (customDesc, filename) => {
    const textToAnalyze = customDesc || description;
    if (!textToAnalyze && !filename && !imageFile) return;

    setAiAnalyzing(true);
    try {
      const res = await analyzeWithAI({
        description: textToAnalyze,
        imageFilename: filename || (imageFile ? imageFile.name : ""),
        landmark,
        area
      });

      if (res.success && res.analysis) {
        setAiResult(res.analysis);
        if (res.analysis.priority) {
          setUserUrgency(res.analysis.priority);
        }
      }
    } catch (err) {
      console.warn("AI analysis preview error:", err);
    } finally {
      setAiAnalyzing(false);
    }
  };

  // ---------------- SUBMIT REPORT ----------------
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!description.trim() && !imageFile && !audioFile) {
      alert("Please provide at least a photo, voice note, or description.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      if (imageFile) formData.append("image", imageFile);
      if (audioFile) formData.append("voiceNote", audioFile);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("landmark", landmark);
      formData.append("area", area);
      formData.append("lat", coords.lat);
      formData.append("lng", coords.lng);
      formData.append("reporter_name", citizenName);
      formData.append("reporter_phone", citizenPhone);
      formData.append("userUrgency", userUrgency);

      const res = await reportIssue(formData);
      if (res.success && res.issue) {
        setSubmittedData(res.issue);
      } else {
        setErrorMessage(res.message || "Failed to submit report. Please check server.");
      }
    } catch (err) {
      setErrorMessage("Network error: Please ensure backend server is running on port 5000.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="max-w-4xl mx-auto my-8 px-4 sm:px-6">
        {/* SUCCESS CONFIRMATION MODAL */}
        {submittedData && (
          <div className="bg-white border-2 border-green-600 p-8 shadow-xl mb-10 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-green-100 text-green-700 mx-auto flex items-center justify-center rounded-full mb-4">
              <CheckCircle2 size={36} />
            </div>

            <span className="text-xs font-bold tracking-widest text-green-700 uppercase bg-green-50 px-3 py-1 border border-green-200">
              Report Successfully Logged & Auto-Routed
            </span>

            <h2 className="text-3xl font-bold mt-3 text-gray-900">
              Tracking ID: <span className="text-green-700">{submittedData.tracking_id}</span>
            </h2>

            <p className="mt-2 text-gray-600 max-w-lg mx-auto">
              Your civic report has been classified by the AI Engine and dispatched directly to{" "}
              <strong>{submittedData.department_name}</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 text-left max-w-2xl mx-auto bg-gray-50 p-4 border border-gray-200">
              <div>
                <span className="text-xs text-gray-500 block">AI Detected Category</span>
                <span className="font-semibold text-gray-900 capitalize">{submittedData.category}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Assigned Priority</span>
                <span className={`font-semibold ${submittedData.priority === 'High' ? 'text-red-600' : 'text-amber-600'}`}>
                  {submittedData.priority} Urgency
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Estimated Resolution SLA</span>
                <span className="font-semibold text-gray-900">{submittedData.sla_hours} Hours</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Link
                to="/track"
                className="sa-btn px-6 py-3 font-semibold flex items-center gap-2"
              >
                Track Your Report Status <ArrowRight size={18} />
              </Link>
              <button
                onClick={() => {
                  setSubmittedData(null);
                  setDescription("");
                  setImageFile(null);
                  setImagePreview(null);
                  setAudioURL(null);
                  setAudioFile(null);
                  setAiResult(null);
                }}
                className="sa-btn secondary px-6 py-3 font-semibold"
              >
                Report Another Issue
              </button>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 shadow-sm p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Report a Civic Issue</h1>
              <p className="text-sm text-gray-500 mt-1">
                Citizen Reporter: <strong>{citizenName}</strong> | Varanasi Municipal Smart Grid
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 border border-green-200">
              <Sparkles size={16} /> AI Routing Engine Active
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertTriangle size={18} /> {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmitReport} className="space-y-8">
            {/* 1. MEDIA UPLOAD: PHOTO & VOICE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PHOTO UPLOAD */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Camera size={18} className="text-green-700" /> Upload Photo Evidence
                </label>
                <div className="border-2 border-dashed border-gray-300 hover:border-green-600 transition p-6 text-center bg-gray-50 cursor-pointer relative min-h-[190px] flex flex-col justify-center items-center">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {!imagePreview ? (
                    <>
                      <div className="w-12 h-12 bg-white rounded-full border border-gray-200 flex items-center justify-center text-gray-500 mb-2 shadow-sm">
                        <Camera size={22} />
                      </div>
                      <p className="font-medium text-sm text-gray-700">Click to Capture or Upload Photo</p>
                      <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP up to 10MB</p>
                    </>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-36 object-contain rounded border border-gray-200 shadow-sm"
                      />
                      <span className="text-xs text-green-700 font-semibold mt-2 block">
                        ✓ Photo attached (Click to change)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* VOICE RECORDING */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Mic size={18} className="text-green-700" /> Voice Note Description (Optional)
                </label>
                <div className="border border-gray-200 p-6 bg-gray-50 min-h-[190px] flex flex-col justify-between">
                  <p className="text-xs text-gray-500 mb-4">
                    Explain the problem in Hindi, Bhojpuri, or English. Our AI analyzes voice notes for urgency and keywords.
                  </p>

                  {!recording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="w-full bg-red-600 text-white py-2.5 px-4 font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition"
                    >
                      <Mic size={18} /> Record Voice Note
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="w-full bg-gray-900 text-white py-2.5 px-4 font-semibold flex items-center justify-center gap-2 animate-pulse"
                    >
                      <Square size={18} /> Stop Recording
                    </button>
                  )}

                  {audioURL && (
                    <div className="mt-3">
                      <audio controls src={audioURL} className="w-full h-10" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. ISSUE DESCRIPTION */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-900">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => triggerAIAnalysis(description)}
                  className="text-xs text-green-700 hover:underline flex items-center gap-1 font-medium"
                >
                  <RefreshCw size={12} /> Re-run AI Analysis
                </button>
              </div>
              <textarea
                rows={3}
                required
                placeholder="E.g., Huge dangerous pothole in the middle of Cantt Road right outside the railway colony entrance causing motorbike skids."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (e.target.value.length % 20 === 0) {
                    triggerAIAnalysis(e.target.value);
                  }
                }}
                className="sa-input w-full"
              />
            </div>

            {/* 3. AI LIVE ANALYSIS CARD (Image 0 & Image 1 requirement) */}
            <div className="border border-green-200 bg-green-50/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-green-700" size={20} />
                  <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase">
                    AI Pre-Processing & Auto-Routing Engine
                  </h3>
                </div>
                {aiAnalyzing && (
                  <span className="text-xs text-green-800 flex items-center gap-1 font-medium animate-pulse">
                    <Loader2 size={14} className="animate-spin" /> Analyzing input...
                  </span>
                )}
              </div>

              {aiResult ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 border border-green-100">
                    <div>
                      <span className="text-xs text-gray-500 block">Classified Category</span>
                      <span className="font-bold text-green-800 capitalize">{aiResult.category}</span>
                      <span className="text-[10px] text-gray-400 block">
                        Confidence: {(aiResult.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-gray-500 block">AI Assessed Urgency</span>
                      <span className={`font-bold ${aiResult.priority === 'High' ? 'text-red-600' : 'text-amber-600'}`}>
                        {aiResult.priority}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-gray-500 block">Auto-Routed Department</span>
                      <span className="font-semibold text-gray-900 text-xs">
                        {aiResult.routing?.department_name}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    "{aiResult.aiAnalysis}"
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-600">
                  Type a description or upload a photo to see live AI categorization, severity scoring, and automated department routing recommendations.
                </p>
              )}

              {/* CITIZEN SET URGENCY LEVEL (Use Case Diagram <<extend>>) */}
              <div className="mt-4 pt-3 border-t border-green-200 flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold text-gray-800">
                  Citizen Verified Urgency Level:
                </span>
                {["Low", "Medium", "High"].map((lvl) => (
                  <label key={lvl} className="flex items-center gap-1 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="urgency"
                      value={lvl}
                      checked={userUrgency === lvl}
                      onChange={(e) => setUserUrgency(e.target.value)}
                    />
                    <span className={`font-medium ${lvl === 'High' ? 'text-red-700' : lvl === 'Medium' ? 'text-amber-700' : 'text-green-700'}`}>
                      {lvl}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. GEOGRAPHIC LOCATION & MAP */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin size={18} className="text-green-700" /> Geographic Coordinates & Area
                </label>
                <button
                  type="button"
                  onClick={detectLocation}
                  className="text-xs text-green-700 hover:underline flex items-center gap-1 font-medium"
                >
                  <RefreshCw size={12} /> Refresh GPS
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Ward / Mohalla / Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DLW Colony, Sigra, Cantt"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="sa-input"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 block mb-1">Nearest Landmark</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Near St. Johns School, DLW Gate"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="sa-input"
                  />
                </div>
              </div>

              {/* Embedded Google Map Preview */}
              <div className="border border-gray-200 overflow-hidden">
                <iframe
                  title="Issue Location Map"
                  className="w-full h-48 border-0"
                  src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
                />
                <div className="bg-gray-100 px-4 py-2 text-xs text-gray-600 flex justify-between items-center">
                  <span>GPS: {location || `Lat: ${coords.lat}, Lng: ${coords.lng}`}</span>
                  <span className="text-green-700 font-medium">✓ Geotag Attached</span>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sa-btn py-4 justify-center text-base font-bold tracking-wide transition shadow-sm"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={20} className="animate-spin" /> Dispatching to Municipal Department...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={20} /> Submit Civic Report to Municipal Authority
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
