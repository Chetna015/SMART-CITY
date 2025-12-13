import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-accent py-20 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">
          Smart Civic Issue Reporting
        </h1>

        <h3 className="text-xl md:text-2xl text-secondary mt-3">
          Report Issues, Track Progress, Build Better Communities
        </h3>

        <p className="text-secondary mt-4 max-w-2xl mx-auto">
          Making our community better, one report at a time
        </p>

        {/* BUTTONS */}
        <div className="mt-10 flex flex-col gap-4 max-w-md mx-auto">
          <a
            href="/report"
            className="btn text-lg py-3 rounded-xl shadow-md hover:shadow-lg"
          >
            Report an Issue
          </a>

          <a
            href="/login"
            className="btn-secondary text-lg py-3 rounded-xl shadow-md hover:shadow-lg"
          >
            Login as Citizen
          </a>

          <a
            href="/admin/login"
            className="btn-secondary text-lg py-3 rounded-xl shadow-md hover:shadow-lg"
          >
            Login as Admin
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
