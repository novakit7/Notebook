import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-light mt-5">
      <div className="container py-3">

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">

          {/* Left Side */}
          <div className="text-light text-decoration-none">
            © {new Date().getFullYear()} Notebook App
          </div>

          {/* Center Links */}
          <div className="small d-flex gap-3 mb-2 mb-md-0">
            <Link
              to="/notes"
             className="text-light text-decoration-underline"
            >
              Notes
            </Link>

            <Link
              to="/profile"
              className="text-light text-decoration-underline"
            >
              Profile
            </Link>
          </div>

          {/* Right Side */}
          <div className="small">
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=admin.app.net@gmail.com&su=Quick%20Notes%20Feedback&body=Hi,%20I%20want%20to%20say..." 
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none text-light">
            Send Feedback</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
