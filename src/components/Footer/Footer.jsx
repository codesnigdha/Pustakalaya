import { BookOpen, Mail, MapPin, Phone, Clock } from "lucide-react";

import { Link } from "react-router-dom";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">
                <BookOpen size={23} />
              </div>

              <div className="footer-logo-text">
                <span>PUSTAKALAYA</span>
                <small>Campus Library</small>
              </div>
            </Link>

            <p>
              Your digital gateway to the campus library. Discover knowledge,
              explore new ideas, and find your next great read.
            </p>
          </div>

          {/* Explore */}
          <div className="footer-column">
            <h4>Explore</h4>

            <Link to="/">Home</Link>

            <Link to="/books">Browse Books</Link>

            <Link to="/about">About Us</Link>

            <Link to="/contact">Contact</Link>
          </div>

          {/* Account */}
          <div className="footer-column">
            <h4>Account</h4>

            <Link to="/login">Login</Link>

            <Link to="/signup">Create Account</Link>

            <Link to="/books">Explore Books</Link>
          </div>

          {/* Contact */}
          <div className="footer-column footer-contact">
            <h4>Library Information</h4>

            <div>
              <MapPin size={15} />
              <span>College Campus Library</span>
            </div>

            <div>
              <Mail size={15} />
              <span>library@college.edu</span>
            </div>

            <div>
              <Phone size={15} />
              <span>+91 00000 00000</span>
            </div>

            <div>
              <Clock size={15} />
              <span>Mon–Fri: 8 AM – 8 PM</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Pustakalaya. All rights reserved.
          </span>

          <span>College Library Management System</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
