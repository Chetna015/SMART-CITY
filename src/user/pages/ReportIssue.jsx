import { useState, useEffect, useRef } from "react";

export default function ReportIssue() {
  const [location, setLocation] = useState("");
  const [landmark, setLandmark] = useState("");
  const [area, setArea] = useState("");

  const [coords, setCoords] = useState({ lat: null, lng: null });

  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // ---------------- IMAGE UPLOAD ----------------
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  // ---------------- AUTO LOCATION DETECT ----------------
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support location access.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });

        // auto-fill
        setLocation(
          `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`
        );
      },
      () => alert("Please enable location access!")
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  // ---------------- VOICE RECORDING ----------------
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "voice_note.mp3", {
          type: "audio/mp3",
        });

        setAudioURL(URL.createObjectURL(audioFile));
        uploadVoice(audioFile);
      };

      recorder.start();
      setRecording(true);
    } catch {
      alert("Microphone access denied!");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const uploadVoice = async (file) => {
    const form = new FormData();
    form.append("voiceNote", file);

    await fetch("http://localhost:5000/uploadVoice", {
      method: "POST",
      body: form,
    });
  };

  // ---------------- SUBMIT FINAL REPORT ----------------
  const submitReport = async () => {
    if (!imageFile) {
      alert("Please upload at least one photo.");
      return;
    }

    const form = new FormData();
    form.append("image", imageFile);
    form.append("description", description);
    form.append("location", location);
    form.append("landmark", landmark);
    form.append("area", area);

    form.append("lat", coords.lat);
    form.append("lng", coords.lng);

    const res = await fetch("http://localhost:5000/report", {
      method: "POST",
      body: form,
    });

    if (res.ok) alert("Issue reported successfully!");
    else alert("Failed to send report.");
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold text-center text-primary mb-6">
        Report an Issue
      </h1>

      {/* IMAGE UPLOAD */}
      <label className="font-semibold">Upload Image</label>
      <div className="mt-2 border-2 border-dashed border-primary rounded-xl p-6 text-center">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          className="w-full cursor-pointer"
        />

        {!imageFile && (
          <p className="text-secondary mt-2">
            Click to open camera or upload from gallery
          </p>
        )}

        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            className="mt-3 w-40 h-40 object-cover mx-auto rounded-lg shadow"
          />
        )}
      </div>

      {/* MAP */}
      {coords.lat && (
        <iframe
          className="w-full h-52 mt-3 rounded-xl border"
          src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
        ></iframe>
      )}

      {/* AREA + LANDMARK */}
      <div className="grid grid-cols-1 gap-4 mt-4">
        <div>
          <label className="font-semibold">Area / Mohalla / House No</label>
          <input
            type="text"
            placeholder="e.g. House No 12, Ram Nagar"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="font-semibold">Landmark</label>
          <input
            type="text"
            placeholder="e.g. Near Hanuman Mandir"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <label className="font-semibold mt-4 block">Issue Description</label>
      <textarea
        placeholder="Describe the issue in detail"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border rounded-lg mt-1"
        rows={4}
      ></textarea>

      {/* VOICE NOTE */}
      <div className="mt-4">
        <label className="font-semibold">Voice Note (Optional)</label>

        {!recording ? (
          <button
            onClick={startRecording}
            className="w-full bg-danger text-white py-2 mt-2 rounded-lg"
          >
            🎤 Start Voice Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-full bg-secondary text-white py-2 mt-2 rounded-lg"
          >
            ⏹ Stop Recording
          </button>
        )}

        {audioURL && (
          <audio
            controls
            src={audioURL}
            className="w-full mt-3 border rounded-lg"
          ></audio>
        )}
      </div>

      {/* SUBMIT */}
      <button
        onClick={submitReport}
        className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
      >
        Submit Report
      </button>
    </div>
  );
}
