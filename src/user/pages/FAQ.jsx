import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function FAQ() {
  const faqs = [
    {
      q: "How do I report an issue?",
      a: "Simply click the 'Report an Issue' button, describe the problem, and optionally add photos. Your report will be automatically routed to the appropriate department.",
    },
    {
      q: "How long does it take to resolve issues?",
      a: "Resolution times vary by issue type and complexity. On average, most issues are resolved within 3-5 business days. You'll receive updates throughout the process.",
    },
    {
      q: "Can I track the status of my report?",
      a: "Yes! You can track your reports in real-time through our tracking system. You'll receive notifications when status changes occur.",
    },
    {
      q: "Is my personal information secure?",
      a: "Absolutely. We use industry-standard encryption and security measures to protect your data. Your personal information is never shared without your consent.",
    },
    {
      q: "Can I report issues anonymously?",
      a: "Yes, you can choose to report issues anonymously. However, providing contact information helps us follow up if we need additional details.",
    },
    {
      q: "What types of issues can I report?",
      a: "You can report various civic issues including potholes, broken streetlights, graffiti, water leaks, noise complaints, and more.",
    },
  ];

  return (
    <>
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-16">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-dark mb-12">
          Frequently Asked Questions
        </h1>

        {/* FAQ Cards */}
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-borderCol hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-dark mb-2">{faq.q}</h3>
              <p className="text-secondary leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
