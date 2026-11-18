import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Camera, Mic, MapPin, Send, Sparkles, Brain, 
  Route, Building2, CheckCircle2, Map, BarChart3, 
  ArrowRight, ShieldCheck, ChevronRight, Zap
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Home() {
  const [activeStage, setActiveStage] = useState(0);

  const workflowStages = [
    {
      id: "user-interaction",
      stageNumber: "01",
      badge: "User Interaction",
      badgeColor: "bg-green-100 text-green-800 border-green-200",
      title: "Citizen Intake",
      icon: Camera,
      shortDesc: "Capture photo/voice and tag location",
      connectorText: "Submits Report"
    },
    {
      id: "ai-processing",
      stageNumber: "02",
      badge: "AI Processing",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      title: "AI Analysis",
      icon: Brain,
      shortDesc: "Vision recognition & priority detection",
      connectorText: "Evaluates Urgency"
    },
    {
      id: "routing",
      stageNumber: "03",
      badge: "Routing Engine",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
      title: "Auto-Dispatch",
      icon: Route,
      shortDesc: "Dispatched to responsible department",
      connectorText: "Assigns Ward Squad"
    },
    {
      id: "resolution",
      stageNumber: "04",
      badge: "Resolution",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      title: "Field Action",
      icon: CheckCircle2,
      shortDesc: "Squad triage & verified fix",
      connectorText: "Closes Ticket"
    },
    {
      id: "insights",
      stageNumber: "05",
      badge: "Visualization",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      title: "GIS & Insights",
      icon: Map,
      shortDesc: "Live maps & city analytics",
      connectorText: "Live Feed"
    }
  ];

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-white border-b border-gray-200">
        <div style={{ background: "rgba(22,163,74,0.06)" }} className="w-full py-4 border-b border-green-100">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-green-800">
              AI-Powered Municipal Smart Civic Grid
            </span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center py-16 px-6">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Report Civic Issues, <span className="text-green-700">Track Progress</span>, Build Better Cities
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connecting citizens with municipal authorities through automated AI classification, 
            rapid emergency routing, and real-time geographic incident tracking.
          </p>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
            <Link to="/report" className="sa-btn px-6 py-3.5 text-sm font-bold flex items-center gap-2 shadow-sm">
              <Zap size={18} /> Report an Issue Now
            </Link>
            <Link to="/track" className="sa-btn secondary px-6 py-3.5 text-sm font-bold flex items-center gap-2">
              Track Existing Report <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* HORIZONTAL WORKFLOW SECTION (Replacing the 6 static cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 border border-green-200 uppercase tracking-widest">
            End-To-End Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
            How Eco-Saathi Works
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto mt-2">
            A seamless horizontal pipeline from citizen mobile capture to AI categorization, 
            automated department dispatch, and live GIS map resolution.
          </p>
        </div>

        {/* HORIZONTAL WORKFLOW PIPELINE */}
        <div className="relative">
          {/* DESKTOP HORIZONTAL CONNECTING LINE */}
          <div className="hidden lg:block absolute top-[52px] left-[5%] right-[5%] h-0.5 bg-gray-200 z-0"></div>

          {/* 5 HORIZONTAL STAGES */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
            {workflowStages.map((stage, idx) => {
              const IconComp = stage.icon;
              const isSelected = activeStage === idx;

              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveStage(idx)}
                  className={`sa-card p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    isSelected 
                      ? "border-green-600 shadow-md ring-1 ring-green-600 bg-white" 
                      : "bg-white hover:border-gray-400"
                  }`}
                >
                  <div>
                    {/* TOP STEP HEADER & ICON */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 flex items-center justify-center font-bold text-sm shadow-sm transition ${
                        isSelected ? "bg-green-700 text-white" : "bg-gray-100 text-gray-700"
                      }`}>
                        <IconComp size={18} />
                      </div>

                      <span className="text-xs font-mono font-extrabold text-gray-400">
                        {stage.stageNumber}
                      </span>
                    </div>

                    {/* BADGE */}
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border inline-block mb-2 ${stage.badgeColor}`}>
                      {stage.badge}
                    </span>

                    {/* TITLE */}
                    <h3 className="font-extrabold text-gray-900 text-base mb-1">
                      {stage.title}
                    </h3>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      {stage.shortDesc}
                    </p>
                  </div>

                  {/* BOTTOM DIRECTIONAL ARROW */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-gray-400">
                    <span>{stage.connectorText}</span>
                    {idx < workflowStages.length - 1 ? (
                      <ArrowRight size={14} className="text-green-700" />
                    ) : (
                      <CheckCircle2 size={14} className="text-green-700" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM WORKFLOW CTA */}
        <div className="mt-8 bg-gray-50 border border-gray-200 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 text-green-800 flex items-center justify-center font-bold text-lg shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                Civic Issues Categorized & Dispatched in Under 60 Seconds
              </h4>
              <p className="text-xs text-gray-500">
                Experience smart camera capture, voice recognition, and automated departmental routing.
              </p>
            </div>
          </div>

          <Link
            to="/report"
            className="sa-btn px-5 py-2.5 text-xs font-semibold whitespace-nowrap self-stretch md:self-auto justify-center"
          >
            Report an Issue Now <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* STATS / IMPACT SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-200">
        <h3 className="text-center text-3xl font-bold mb-2 text-gray-900">
          Our Impact in Numbers
        </h3>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Real results delivered through automated civic operations
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "1,247", label: "Issues Logged" },
            { value: "98.4%", label: "AI Classification Accuracy" },
            { value: "83%", label: "Resolution SLA Met" },
            { value: "< 24h", label: "Average Response Time" },
          ].map((s) => (
            <div key={s.label} className="sa-card p-6 text-center">
              <div className="text-3xl font-extrabold text-green-700">
                {s.value}
              </div>
              <div className="text-xs text-gray-500 mt-1 font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 bg-gray-50 border-t border-gray-200">
        <h3 className="text-center text-2xl font-bold mb-6 text-gray-900">
          What Citizens & Municipal Officers Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "The instant voice note recording and auto-location detection made reporting a deep pothole in DLW take under 30 seconds. PWD fixed it within 24 hours!",
              name: "Priya Sharma",
              role: "Resident, DLW Colony",
            },
            {
              quote:
                "The AI engine automatically classifies the issue and prioritizes emergencies. Our sanitation field squads now receive clean, geotagged work orders directly.",
              name: "Sonia Verma",
              role: "Health & Sanitation Officer",
            },
            {
              quote:
                "The city-wide GIS hotspot map gives our administration complete visibility into ward-by-ward resolution performance in real-time.",
              name: "Arjun Mehta",
              role: "Municipal Corporator",
            },
          ].map((t) => (
            <div key={t.name} className="sa-card p-6 bg-white">
              <div className="mb-3 text-amber-500 text-sm">★★★★★</div>
              <blockquote className="italic text-xs text-gray-600 leading-relaxed">
                "{t.quote}"
              </blockquote>
              <div className="mt-4 font-bold text-sm text-gray-900">{t.name}</div>
              <div className="text-xs text-green-700 font-medium">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
