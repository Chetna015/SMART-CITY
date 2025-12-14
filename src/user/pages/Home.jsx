import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-[var(--background)]">
        {/* thin green banner */}
        <div
          style={{ background: "rgba(22,163,74,0.06)" }}
          className="w-full py-6"
        >
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-center text-lg md:text-xl font-semibold text-[var(--text)]">
              Smart Civic Issue Reporting
            </h1>
          </div>
        </div>

        {/* main hero content */}
        <div className="max-w-4xl mx-auto text-center py-20 px-6">
          <h2 className="text-2xl md:text-4xl font-bold text-[var(--primary-blue)]">
            Report Issues, Track Progress, Build Better Communities
          </h2>

          <p className="mt-4 text-[var(--soft-text)] max-w-2xl mx-auto">
            Our platform connects citizens with local authorities to efficiently
            report and resolve civic issues in your neighborhood. Join thousands
            of citizens making a difference.
          </p>

          <div className="mt-8">
            <a href="/report" className="sa-btn inline-block">
              Report an issue
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES / CARDS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-center text-3xl font-bold mb-4">
          Why Choose Our Platform?
        </h3>
        <p className="text-center text-[var(--soft-text)] mb-8">
          Discover the features that make civic engagement easier and more
          effective.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Lightning Fast Reporting",
              body: "Report issues in under 30 seconds with our streamlined interface. Voice recording, photo uploads, and smart categorization make it effortless.",
            },
            {
              title: "Real-time Updates",
              body: "Get instant notifications when your reports are received, assigned, in progress, or completed.",
            },
            {
              title: "Secure & Private",
              body: "Your data is protected with enterprise-grade security. Report anonymously or with full transparency.",
            },
            {
              title: "Community Impact",
              body: "See how your reports contribute to community improvements and local decision making.",
            },
            {
              title: "Collaborative Platform",
              body: "Connect with neighbors and municipal teams to resolve issues faster.",
            },
            {
              title: "Proven Results",
              body: "Join thousands of satisfied users who have seen faster resolutions.",
            },
          ].map((c) => (
            <div key={c.title} className="sa-card p-6">
              <div className="w-12 h-12 bg-[var(--background)] flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[var(--primary-blue)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">{c.title}</h4>
              <p className="text-sm text-[var(--soft-text)]">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 bg-[var(--background)]">
        <h3 className="text-center text-3xl font-bold mb-6">
          What Our Users Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "This platform has transformed how we handle civic issues in our locality. Response times have improved dramatically!",
              name: "Priya Sharma",
              role: "Community Leader",
            },
            {
              quote:
                "I love how easy it is to report problems and track their progress. The voice recording feature is a game-changer.",
              name: "Arjun Mehta",
              role: "Local Resident",
            },
            {
              quote:
                "The admin dashboard gives us incredible insights into community needs. It's made our job so much more effective.",
              name: "Kavya Nair",
              role: "Municipal Corporator",
            },
          ].map((t) => (
            <div key={t.name} className="sa-card p-6">
              <div className="mb-4">⭐️⭐️⭐️⭐️⭐️</div>
              <blockquote className="italic text-[var(--soft-text)]">
                "{t.quote}"
              </blockquote>
              <div className="mt-6 font-semibold">{t.name}</div>
              <div className="text-sm text-[var(--soft-text)]">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS / IMPACT SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-center text-3xl font-bold mb-2">
          Our Impact in Numbers
        </h3>
        <p className="text-center text-[var(--soft-text)] mb-8">
          Real results from real communities
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { value: "1,247", label: "Issues Reported" },
            { value: "892", label: "Issues Resolved" },
            { value: "72%", label: "Resolution Rate" },
            { value: "3.2", label: "Avg. Days to Resolve" },
          ].map((s) => (
            <div key={s.label} className="sa-card p-6 text-center">
              <div
                style={{ background: "rgba(22,163,74,0.06)" }}
                className="mb-4 w-14 h-14 mx-auto flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[var(--primary-blue)]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="6" />
                </svg>
              </div>
              <div className="text-3xl font-extrabold text-[var(--primary-blue)]">
                {s.value}
              </div>
              <div className="text-sm text-[var(--soft-text)] mt-2">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
