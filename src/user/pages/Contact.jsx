import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Contact() {
  return (
    <>
      <Navbar />

      {/* FULL SCREEN CONTACT */}
      <section className="min-h-screen flex items-center justify-center px-6 py-10">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Title for mobile */}
          <h1 className="text-4xl font-bold text-center text-dark md:hidden mb-6">
            Contact Us
          </h1>

          {/* LEFT SIDE */}
          <div className="space-y-10">
            <h1 className="text-4xl font-bold text-dark hidden md:block mb-4">
              Contact Us
            </h1>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="text-green-700 text-3xl">
                <i className="fas fa-phone"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark">
                  Phone Support
                </h3>
                <p className="text-secondary text-sm">+91 98765 43210</p>
                <p className="text-secondary text-sm">Mon–Fri, 9AM–6PM IST</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="text-green-700 text-3xl">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark">
                  Email Support
                </h3>
                <p className="text-secondary text-sm">
                  support@civicreport.com
                </p>
                <p className="text-secondary text-sm">
                  Response within 24 hours
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-4">
              <div className="text-green-700 text-3xl">
                <i className="fas fa-location-dot"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark">
                  Office Address
                </h3>
                <p className="text-secondary text-sm">
                  456 Civil Lines Road <br />
                  Kanpur, Uttar Pradesh 208001
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="sa-card p-10">
            <h3 className="text-xl font-semibold text-[var(--text)] mb-1">
              Send us a Message
            </h3>
            <p className="text-[var(--soft-text)] mb-6">
              We'd love to hear from you
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="sa-input" placeholder="First Name" />
              <input className="sa-input" placeholder="Last Name" />
            </div>

            <input className="sa-input mt-4" placeholder="Email" />
            <input className="sa-input mt-4" placeholder="Subject" />
            <textarea
              className="sa-input h-32 mt-4"
              placeholder="Your message here..."
            />

            <button className="sa-btn w-full mt-6">Send Message</button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
