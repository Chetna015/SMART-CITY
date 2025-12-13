import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Services() {
  const services = [
    {
      title: "Issue Reporting",
      desc: "Quick and easy reporting with photo uploads and detailed descriptions.",
      icon: "fas fa-camera",
    },
    {
      title: "Real-time Notifications",
      desc: "Stay updated with instant notifications about your reported issues.",
      icon: "fas fa-bell",
    },
    {
      title: "Issue Tracking",
      desc: "Track the progress of your reports from submission to resolution.",
      icon: "fas fa-search",
    },
    {
      title: "Analytics Dashboard",
      desc: "Comprehensive analytics for administrators to monitor performance.",
      icon: "fas fa-chart-line",
    },
    {
      title: "Community Feedback",
      desc: "Engage with your community and provide feedback on resolved issues.",
      icon: "fas fa-comment-alt",
    },
    {
      title: "Multi-platform Access",
      desc: "Access our platform from web, mobile, or tablet devices.",
      icon: "fas fa-globe",
    },
  ];

  return (
    <>
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-dark mb-12">
          Our Services
        </h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((srv, index) => (
            <div
              key={index}
              className="bg-[#f8f9f9] p-10 rounded-2xl shadow-sm border border-borderCol text-center hover:shadow-md transition"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mx-auto mb-5 text-green-700 text-2xl">
                <i className={srv.icon}></i>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-dark">{srv.title}</h3>

              {/* Description */}
              <p className="text-secondary mt-2 leading-relaxed text-sm">
                {srv.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
