import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
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

import { registerUser } from "../../../services/authService";
import { useTheme } from "../../../context/ThemeContext";

import "./SignupLibrarian.css";

function SignupLibrarian() {
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    employeeId: "",
    department: "Library",
    designation: "",
    libraryStaffId: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [agree, setAgree] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /* =====================================================
     CHANGE
  ===================================================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Please enter your full name.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email.";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return "Please enter a valid email.";
    }

    if (!formData.age) {
      return "Please enter your age.";
    }

    if (Number(formData.age) < 18 || Number(formData.age) > 100) {
      return "Please enter a valid age.";
    }

    if (!formData.employeeId.trim()) {
      return "Please enter your employee ID.";
    }

    if (!formData.designation.trim()) {
      return "Please enter your designation.";
    }

    if (!formData.libraryStaffId.trim()) {
      return "Please enter your library staff ID.";
    }

    if (!formData.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (formData.phone.length !== 10) {
      return "Please enter a valid 10-digit phone number.";
    }

    if (!formData.password) {
      return "Please create a password.";
    }

    if (formData.password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!agree) {
      return "Please accept the terms and conditions.";
    }

    return "";
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const data = {
      ...formData,
      role: "Librarian",
    };

    const result = registerUser(data);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess("Librarian account created successfully. Redirecting...");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="signup-librarian-page">
      {/* =================================================
          THEME
      ================================================= */}

      <button
        type="button"
        className="signup-librarian-theme"
        onClick={toggleTheme}
        title={
          theme === "light" ? "Switch to dark mode" : "Switch to light mode"
        }
      >
        {theme === "light" ? "☾" : "☀"}
      </button>

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <main className="signup-librarian-container">
        {/* Back */}

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
            ALERT
        ================================================= */}

        {error && <div className="signup-librarian-alert error">{error}</div>}

        {success && (
          <div className="signup-librarian-alert success">{success}</div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form className="signup-librarian-form" onSubmit={handleSubmit}>
          {/* =================================================
              FULL NAME
          ================================================= */}

          <div className="signup-librarian-field full">
            <label>Full Name *</label>

            <div className="signup-librarian-input">
              <UserRound size={16} />

              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="signup-librarian-field">
            <label>Official Email *</label>

            <div className="signup-librarian-input">
              <Mail size={16} />

              <input
                name="email"
                type="email"
                placeholder="name@college.edu"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* =================================================
              PHONE
          ================================================= */}

          <div className="signup-librarian-field">
            <label>Phone Number *</label>

            <div className="signup-librarian-input">
              <Phone size={16} />

              <input
                name="phone"
                type="tel"
                maxLength="10"
                placeholder="10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* =================================================
              EMPLOYEE ID
          ================================================= */}

          <div className="signup-librarian-field">
            <label>Employee ID *</label>

            <div className="signup-librarian-input">
              <UserRound size={16} />

              <input
                name="employeeId"
                type="text"
                placeholder="College employee ID"
                value={formData.employeeId}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* =================================================
              DESIGNATION
          ================================================= */}

          <div className="signup-librarian-field">
            <label>Designation *</label>

            <div className="signup-librarian-input">
              <Library size={16} />

              <input
                name="designation"
                type="text"
                placeholder="e.g. Librarian"
                value={formData.designation}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* =================================================
              DEPARTMENT
          ================================================= */}

          <div className="signup-librarian-field">
            <label>Department</label>

            <div className="signup-librarian-input">
              <Library size={16} />

              <input
                name="department"
                type="text"
                placeholder="Library"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* =================================================
              LIBRARY STAFF ID
          ================================================= */}

          <div className="signup-librarian-field">
            <label>Library Staff ID *</label>

            <div className="signup-librarian-input">
              <Library size={16} />

              <input
                name="libraryStaffId"
                type="text"
                placeholder="Library staff ID"
                value={formData.libraryStaffId}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="signup-librarian-field">
            <label>Password *</label>

            <div className="signup-librarian-input">
              <LockKeyhole size={16} />

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="signup-librarian-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* =================================================
              CONFIRM PASSWORD
          ================================================= */}

          <div className="signup-librarian-field">
            <label>Confirm Password *</label>

            <div className="signup-librarian-input">
              <LockKeyhole size={16} />

              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                className="signup-librarian-eye"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            />

            <span>I agree to the library terms and conditions.</span>
          </label>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <button type="submit" className="signup-librarian-submit">
            Create Librarian Account
            <ArrowRight size={16} />
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
