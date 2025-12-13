import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />

      {/* FULL SCREEN ABOUT SECTION */}
      <section className="min-h-screen px-6 py-12 flex flex-col justify-center">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-dark mb-4">
          About EcoSaathi
        </h1>

        <p className="text-secondary text-center max-w-3xl mx-auto text-lg mb-16">
          We're dedicated to bridging the gap between citizens and local
          government through innovative technology.
        </p>

        {/* 2 COLUMN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* LEFT SIDE — Mission */}
          <div>
            <h2 className="text-2xl font-bold text-dark mb-4">Our Mission</h2>

            <p className="text-secondary leading-relaxed mb-6">
              To empower communities by providing a seamless platform for
              reporting civic issues and tracking their resolution. We believe
              that every citizen deserves a voice in improving their
              neighborhood.
            </p>

            {/* Mission Icons */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <i className="fas fa-shield-alt text-green-700 text-xl"></i>
                <p className="text-dark font-medium">
                  Secure and private reporting
                </p>
              </div>

              <div className="flex items-center gap-3">
                <i className="fas fa-users text-green-700 text-xl"></i>
                <p className="text-dark font-medium">
                  Community-driven solutions
                </p>
              </div>

              <div className="flex items-center gap-3">
                <i className="fas fa-medal text-green-700 text-xl"></i>
                <p className="text-dark font-medium">Transparent governance</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — Impact Section */}
          <div>
            <h2 className="text-2xl font-bold text-dark mb-6">Our Impact</h2>

            <div className="grid grid-cols-2 gap-6">
              {/* Stat Card */}
              <div className="p-8 bg-white rounded-2xl shadow-sm border border-borderCol text-center">
                <h3 className="text-3xl font-bold text-green-700">50+</h3>
                <p className="text-secondary">Cities Served</p>
              </div>

              <div className="p-8 bg-white rounded-2xl shadow-sm border border-borderCol text-center">
                <h3 className="text-3xl font-bold text-green-700">10K+</h3>
                <p className="text-secondary">Active Users</p>
              </div>

              <div className="p-8 bg-white rounded-2xl shadow-sm border border-borderCol text-center">
                <h3 className="text-3xl font-bold text-green-700">25K+</h3>
                <p className="text-secondary">Issues Resolved</p>
              </div>

              <div className="p-8 bg-white rounded-2xl shadow-sm border border-borderCol text-center">
                <h3 className="text-3xl font-bold text-green-700">4.8★</h3>
                <p className="text-secondary">User Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
