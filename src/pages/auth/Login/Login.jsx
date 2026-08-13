import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Moon,
  Sun,
  UserRound,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { loginUser } from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, toggleTheme } = useTheme();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =========================
     HANDLE INPUT
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =========================
     HANDLE LOGIN
  ========================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    /* Email validation */

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    /* Password validation */

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);

    /* Login using LocalStorage */

    const result = loginUser(formData.email, formData.password);

    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    /*
      IMPORTANT:
      Update AuthContext immediately.
    */

    login(result.user);

    setSuccess("Login successful. Redirecting...");

    /*
      Redirect after a short delay
      so the success message can be seen.
    */

    setTimeout(() => {
      const from = location.state?.from || "/dashboard";

      navigate(from, {
        replace: true,
      });
    }, 700);
  };

  /* =========================
     FORGOT PASSWORD
  ========================= */

  const handleForgotPassword = () => {
    alert("Password recovery will be added later.");
  };

  return (
    <div className="login-page">
      {/* =====================================================
          LEFT BRAND PANEL
      ===================================================== */}

      <section className="login-brand-panel">
        <div className="login-brand-pattern"></div>

        {/* Logo */}

        <Link to="/" className="login-brand-logo">
          <div className="login-brand-logo-icon">
            <BookOpen size={25} />
          </div>

          <div>
            <strong>PUSTAKALAYA</strong>

            <span>Campus Library</span>
          </div>
        </Link>

        {/* Brand Content */}

        <div className="login-brand-content">
          <span className="login-brand-label">WELCOME BACK</span>

          <h1>
            Continue Your
            <span>Reading Journey.</span>
          </h1>

          <p>
            Sign in to access your library dashboard, manage borrowed books,
            reservations, wishlist and more.
          </p>

          <div className="login-brand-feature">
            <div>
              <BookOpen size={20} />
            </div>

            <span>Thousands of books at your fingertips.</span>
          </div>
        </div>

        {/* Footer */}

        <div className="login-brand-footer">
          College Library Management System
        </div>
      </section>

      {/* =====================================================
          RIGHT FORM PANEL
      ===================================================== */}

      <section className="login-form-panel">
        {/* Theme Button */}

        <button
          type="button"
          className="login-theme-btn"
          onClick={toggleTheme}
          title={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="login-form-container">
          {/* =================================================
              MOBILE LOGO
          ================================================= */}

          <div className="login-mobile-logo">
            <div className="login-mobile-logo-icon">
              <BookOpen size={22} />
            </div>

            <span>PUSTAKALAYA</span>
          </div>

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="login-heading">
            <span>ACCOUNT ACCESS</span>

            <h2>
              Welcome <em>Back</em>
            </h2>

            <p>Enter your details to access your account.</p>
          </div>

          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (
            <div className="login-alert login-alert-error">
              <AlertCircle size={17} />

              <span>{error}</span>
            </div>
          )}

          {/* =================================================
              SUCCESS MESSAGE
          ================================================= */}

          {success && (
            <div className="login-alert login-alert-success">
              <CheckCircle2 size={17} />

              <span>{success}</span>
            </div>
          )}

          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form className="login-form" onSubmit={handleSubmit}>
            {/* ================= EMAIL ================= */}

            <div className="login-field">
              <label htmlFor="email">Email Address</label>

              <div className="login-input-wrapper">
                <Mail size={17} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* ================= PASSWORD ================= */}

            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="password">Password</label>

                <button
                  type="button"
                  className="login-forgot"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="login-input-wrapper">
                <LockKeyhole size={17} />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* ================= SUBMIT ================= */}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}

              {!isSubmitting && <ArrowRight size={17} />}
            </button>
          </form>

          {/* =================================================
              SIGNUP DIVIDER
          ================================================= */}

          <div className="login-divider">
            <span>New to Pustakalaya?</span>
          </div>

          {/* =================================================
              CREATE ACCOUNT
          ================================================= */}

          <Link to="/signup" className="login-create-btn">
            Create an Account
          </Link>

          {/* =================================================
              CONTINUE AS GUEST
          ================================================= */}

          <Link to="/" className="login-back-home">
            <UserRound size={14} />
            Continue as Guest
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Login;
