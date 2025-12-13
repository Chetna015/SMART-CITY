export default function Footer() {
  return (
    <footer className="bg-light border-t border-borderCol mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-green-600">Eco-Saathi</h2>
          <p className="text-secondary mt-3 leading-relaxed">
            Connecting citizens with local authorities to build better
            communities through efficient issue reporting and resolution.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4 text-secondary">
            <i className="fab fa-facebook cursor-pointer hover:text-primary"></i>
            <i className="fab fa-twitter cursor-pointer hover:text-primary"></i>
            <i className="fab fa-instagram cursor-pointer hover:text-primary"></i>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-dark">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-secondary">
            <li>
              <a className="hover:text-primary" href="/">
                Home
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="/services">
                Services
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="/about">
                About Us
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="/privacy">
                Privacy Policy
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="/terms">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold text-dark">Services</h3>
          <ul className="mt-4 space-y-2 text-secondary">
            <li>Issue Reporting</li>
            <li>Status Tracking</li>
            <li>Admin Dashboard</li>
            <li>Analytics</li>
            <li>API Access</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-dark">Contact Us</h3>

          <ul className="mt-4 space-y-3 text-secondary">
            <li>📞 +91 98765 43210</li>
            <li>📧 support@civicreport.com</li>
            <li>
              📍 456 Civil Lines Road <br />
              Kanpur, Uttar Pradesh 208001
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center py-4 border-t border-borderCol text-secondary">
        © 2025 Eco Saathi. All rights reserved.
      </div>
    </footer>
  );
}
