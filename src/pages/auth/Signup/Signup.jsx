import { ArrowLeft, BookOpen, Library, UserRound } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useTheme } from "../../../context/ThemeContext";

import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  return (
    <div className="signup-page">
      {/* =====================================================
          LEFT BRAND PANEL
      ===================================================== */}

      <section className="signup-brand-panel">
        <div className="signup-brand-pattern"></div>

        {/* Logo */}

        <Link to="/" className="signup-brand-logo">
          <div className="signup-brand-logo-icon">
            <BookOpen size={24} />
          </div>

          <div>
            <strong>PUSTAKALAYA</strong>

            <span>Campus Library</span>
          </div>
        </Link>

        {/* Brand Content */}

        <div className="signup-brand-content">
          <span className="signup-brand-label">JOIN PUSTAKALAYA</span>

          <h1>
            Begin Your
            <span>Library Journey.</span>
          </h1>

          <p>
            Create your Pustakalaya account and get access to books, borrowing
            history, reservations, wishlist and other library services.
          </p>

          {/* Benefits */}

          <div className="signup-benefits">
            <div>
              <BookOpen size={18} />

              <span>Access the college library catalogue</span>
            </div>

            <div>
              <UserRound size={18} />

              <span>Personalized student and teacher account</span>
            </div>

            <div>
              <Library size={18} />

              <span>Manage your library activities</span>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="signup-brand-footer">
          College Library Management System
        </div>
      </section>

      {/* =====================================================
          RIGHT FORM PANEL
      ===================================================== */}

      <section className="signup-form-panel">
        {/* Theme Button */}

        <button
          type="button"
          className="signup-theme-btn"
          onClick={toggleTheme}
          title={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
        >
          {theme === "light" ? "☾" : "☀"}
        </button>

        {/* Form Container */}

        <div className="signup-form-container">
          {/* =================================================
              MOBILE LOGO
          ================================================= */}

          <div className="signup-mobile-logo">
            <div className="signup-mobile-logo-icon">
              <BookOpen size={22} />
            </div>

            <span>PUSTAKALAYA</span>
          </div>

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="signup-heading">
            <span>CREATE ACCOUNT</span>

            <h2>
              Join <em>Pustakalaya</em>
            </h2>

            <p>Select the type of account you want to create.</p>
          </div>

          {/* =================================================
              ACCOUNT OPTIONS
          ================================================= */}

          <div className="signup-account-options">
            {/* =================================================
                USER ACCOUNT
            ================================================= */}

            <button
              type="button"
              className="signup-account-card"
              onClick={() => navigate("/signup/user")}
            >
              <div className="signup-account-icon">
                <UserRound size={25} />
              </div>

              <div className="signup-account-content">
                <h3>User Account</h3>

                <p>For students and teachers of the college.</p>

                <span>Student / Teacher</span>
              </div>

              <div className="signup-account-arrow">→</div>
            </button>

            {/* =================================================
                LIBRARIAN ACCOUNT
            ================================================= */}

            <button
              type="button"
              className="signup-account-card"
              onClick={() => navigate("/signup/librarian")}
            >
              <div className="signup-account-icon">
                <Library size={25} />
              </div>

              <div className="signup-account-content">
                <h3>Librarian Account</h3>

                <p>For authorized college library staff.</p>

                <span>Librarian</span>
              </div>

              <div className="signup-account-arrow">→</div>
            </button>
          </div>

          {/* =================================================
              LOGIN
          ================================================= */}

          <div className="signup-login-text">
            <span>Already have an account?</span>

            <Link to="/login">Sign In</Link>
          </div>

          {/* =================================================
              BACK TO HOME
          ================================================= */}

          <Link to="/" className="signup-back-home">
            <ArrowLeft size={16} />

            <span>Back to Home</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Signup;
