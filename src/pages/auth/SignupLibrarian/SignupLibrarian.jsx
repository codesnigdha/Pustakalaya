import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Library,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signupLibrarian } from "../../../services/authService";
import { useTheme } from "../../../context/ThemeContext";

import "./SignupLibrarian.css";

function SignupLibrarian() {
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  /* =====================================================
     FORM DATA
  ===================================================== */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    libraryStaffId: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });

  /* =====================================================
     STATES
  ===================================================== */

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [agree, setAgree] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  /* =====================================================
     DESIGNATION OPTIONS
  ===================================================== */

  const designationOptions = [
    "Chief Librarian",
    "Senior Librarian",
    "Librarian",
    "Assistant Librarian",
    "Library Manager",
    "Library Staff",
  ];

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =====================================================
     HANDLE PHONE
  ===================================================== */

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setFormData((previous) => ({
        ...previous,
        phone: value,
      }));
    }

    setError("");
    setSuccess("");
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateForm = () => {
    /* NAME */

    if (!formData.name.trim()) {
      return "Please enter your full name.";
    }

    /* EMAIL */

    if (!formData.email.trim()) {
      return "Please enter your email.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    /* PHONE */

    if (!formData.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      return "Please enter a valid 10-digit phone number.";
    }

    /* LIBRARIAN ID */

    if (!formData.libraryStaffId.trim()) {
      return "Please enter your librarian ID.";
    }

    /* DESIGNATION */

    if (!formData.designation) {
      return "Please select your designation.";
    }

    /* PASSWORD */

    if (!formData.password) {
      return "Please create a password.";
    }

    if (formData.password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    /* CONFIRM PASSWORD */

    if (!formData.confirmPassword) {
      return "Please confirm your password.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    /* TERMS */

    if (!agree) {
      return "Please accept the terms and conditions.";
    }

    return "";
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      /* =================================================
         DATA SENT TO SPRING BOOT
         
         IMPORTANT:
         confirmPassword is NOT sent to backend.
      ================================================= */

      const librarianData = {
        name: formData.name.trim(),

        email: formData.email.trim().toLowerCase(),

        phone: formData.phone.trim(),

        libraryStaffId: formData.libraryStaffId.trim(),

        designation: formData.designation,

        password: formData.password,

        role: "LIBRARIAN",
      };

      console.log("Sending librarian data:", librarianData);

      /* =================================================
         API CALL
      ================================================= */

      const result = await signupLibrarian(librarianData);

      console.log("Librarian signup response:", result);

      /* =================================================
         SUCCESS
      ================================================= */

      setSuccess("Librarian account created successfully. Redirecting...");

      /* =================================================
         REDIRECT
      ================================================= */

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Librarian signup failed:", error);

      setError(error.message || "Unable to create librarian account.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="signup-librarian-page">
      {/* =================================================
          THEME BUTTON
      ================================================= */}

      <button
        type="button"
        className="signup-librarian-theme"
        onClick={toggleTheme}
        title={
          theme === "light" ? "Switch to dark mode" : "Switch to light mode"
        }
        aria-label="Toggle theme"
      >
        {theme === "light" ? "☾" : "☀"}
      </button>

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <main className="signup-librarian-container">
        {/* =================================================
            BACK
        ================================================= */}

        <Link to="/signup" className="signup-librarian-back">
          <ArrowLeft size={14} />
          Account Type
        </Link>

        {/* =================================================
            HEADING
        ================================================= */}

        <div className="signup-librarian-heading">
          <span>LIBRARIAN ACCOUNT</span>

          <h1>
            Create your <em>account.</em>
          </h1>

          <p>Enter your official library staff details below.</p>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && <div className="signup-librarian-alert error">{error}</div>}

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div className="signup-librarian-alert success">{success}</div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form className="signup-librarian-form" onSubmit={handleSubmit}>
          {/* =================================================
              NAME
          ================================================= */}

          <div className="signup-librarian-field full">
            <label htmlFor="name">Full Name *</label>

            <div className="signup-librarian-input">
              <UserRound size={16} />

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                disabled={loading}
              />
            </div>
          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="signup-librarian-field">
            <label htmlFor="email">Email Address *</label>

            <div className="signup-librarian-input">
              <Mail size={16} />

              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@college.edu"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          {/* =================================================
              PHONE
          ================================================= */}

          <div className="signup-librarian-field">
            <label htmlFor="phone">Phone Number *</label>

            <div className="signup-librarian-input">
              <Phone size={16} />

              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit phone number"
                value={formData.phone}
                onChange={handlePhoneChange}
                autoComplete="tel"
                disabled={loading}
              />
            </div>
          </div>

          {/* =================================================
              LIBRARIAN ID
          ================================================= */}

          <div className="signup-librarian-field">
            <label htmlFor="libraryStaffId">Librarian ID *</label>

            <div className="signup-librarian-input">
              <Library size={16} />

              <input
                id="libraryStaffId"
                name="libraryStaffId"
                type="text"
                placeholder="Enter librarian ID"
                value={formData.libraryStaffId}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* =================================================
              DESIGNATION
          ================================================= */}

          <div className="signup-librarian-field">
            <label htmlFor="designation">Designation *</label>

            <div className="signup-librarian-input">
              <Library size={16} />

              <select
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select designation</option>

                {designationOptions.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="signup-librarian-field">
            <label htmlFor="password">Password *</label>

            <div className="signup-librarian-input">
              <LockKeyhole size={16} />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={loading}
              />

              <button
                type="button"
                className="signup-librarian-eye"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* =================================================
              CONFIRM PASSWORD
          ================================================= */}

          <div className="signup-librarian-field">
            <label htmlFor="confirmPassword">Confirm Password *</label>

            <div className="signup-librarian-input">
              <LockKeyhole size={16} />

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={loading}
              />

              <button
                type="button"
                className="signup-librarian-eye"
                onClick={() => setShowConfirmPassword((previous) => !previous)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* =================================================
              TERMS
          ================================================= */}

          <label className="signup-librarian-terms">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              disabled={loading}
            />

            <span>I agree to the library terms and conditions.</span>
          </label>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="submit"
            className="signup-librarian-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Librarian Account"}

            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* =================================================
            LOGIN
        ================================================= */}

        <div className="signup-librarian-login">
          Already have an account?
          <Link to="/login">Sign In</Link>
        </div>
      </main>
    </div>
  );
}

export default SignupLibrarian;
