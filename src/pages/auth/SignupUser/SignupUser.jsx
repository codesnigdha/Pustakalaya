import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  Library,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useTheme } from "../../../context/ThemeContext";

import "./SignupUser.css";

function SignupUser() {
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  /* =====================================================
     ACCOUNT TYPE
  ===================================================== */

  const [accountType, setAccountType] = useState("Student");

  /* =====================================================
     PASSWORD VISIBILITY
  ===================================================== */

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* =====================================================
     TERMS
  ===================================================== */

  const [agreeTerms, setAgreeTerms] = useState(false);

  /* =====================================================
     ALERTS
  ===================================================== */

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /* =====================================================
     FORM DATA
  ===================================================== */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",

    /* Student */
    course: "",
    semester: "",

    /* Common */
    department: "",
    libraryRegNo: "",

    /* Teacher */
    employeeId: "",
    designation: "",

    /* Authentication */
    password: "",
    confirmPassword: "",
  });

  /* =====================================================
     HANDLE INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setError("");
    setSuccess("");
  };

  /* =====================================================
     HANDLE ACCOUNT TYPE
  ===================================================== */

  const handleAccountType = (type) => {
    setAccountType(type);

    /*
      Clear fields that belong to the
      previously selected account type.
    */

    setFormData((previous) => ({
      ...previous,

      course: "",
      semester: "",

      employeeId: "",
      designation: "",

      libraryRegNo: "",
    }));

    setError("");
    setSuccess("");
  };

  /* =====================================================
     VALIDATE FORM
  ===================================================== */

  const validateForm = () => {
    /* =================================================
       COMMON DETAILS
    ================================================= */

    if (!formData.name.trim()) {
      return "Please enter your full name.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      return "Please enter a valid 10-digit phone number.";
    }

    /* =================================================
       STUDENT DETAILS
    ================================================= */

    if (accountType === "Student") {
      if (!formData.course.trim()) {
        return "Please enter your course.";
      }

      if (!formData.semester) {
        return "Please select your semester.";
      }
    }

    /* =================================================
       TEACHER DETAILS
    ================================================= */

    if (accountType === "Teacher") {
      if (!formData.designation.trim()) {
        return "Please enter your designation.";
      }

      if (!formData.employeeId.trim()) {
        return "Please enter your employee ID.";
      }
    }

    /* =================================================
       DEPARTMENT
    ================================================= */

    if (!formData.department.trim()) {
      return "Please enter your department.";
    }

    /* =================================================
       LIBRARY REGISTRATION
    ================================================= */

    if (!formData.libraryRegNo.trim()) {
      return "Please enter your library registration number.";
    }

    /* =================================================
       PASSWORD
    ================================================= */

    if (!formData.password) {
      return "Please enter a password.";
    }

    if (formData.password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    /* =================================================
       CONFIRM PASSWORD
    ================================================= */

    if (!formData.confirmPassword) {
      return "Please confirm your password.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    /* =================================================
       TERMS
    ================================================= */

    if (!agreeTerms) {
      return "Please agree to the library terms and conditions.";
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

    /* =================================================
       VALIDATE
    ================================================= */

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    /* =================================================
       GET EXISTING USERS
    ================================================= */

    const existingUsers =
      JSON.parse(localStorage.getItem("pustakalaya_users")) || [];

    /* =================================================
       CHECK EMAIL
    ================================================= */

    const emailExists = existingUsers.some(
      (user) =>
        user.email?.toLowerCase() === formData.email.trim().toLowerCase(),
    );

    if (emailExists) {
      setError("An account with this email already exists.");

      return;
    }

    /* =================================================
       CREATE USER
    ================================================= */

    const newUser = {
      id: Date.now(),

      /* Common */

      name: formData.name.trim(),

      email: formData.email.trim(),

      phone: formData.phone.trim(),

      department: formData.department.trim(),

      libraryRegNo: formData.libraryRegNo.trim(),

      /* Account */

      role: accountType,

      accountType: accountType,

      /* Student */

      course: accountType === "Student" ? formData.course.trim() : "",

      semester: accountType === "Student" ? formData.semester : "",

      /* Teacher */

      designation: accountType === "Teacher" ? formData.designation.trim() : "",

      employeeId: accountType === "Teacher" ? formData.employeeId.trim() : "",

      /* Authentication */

      password: formData.password,

      createdAt: new Date().toISOString(),
    };

    /* =================================================
       SAVE USER
    ================================================= */

    existingUsers.push(newUser);

    localStorage.setItem("pustakalaya_users", JSON.stringify(existingUsers));

    /* =================================================
       SUCCESS
    ================================================= */

    setSuccess("Account created successfully. Redirecting...");

    /* =================================================
       REDIRECT TO LOGIN
    ================================================= */

    setTimeout(() => {
      navigate("/login");
    }, 900);
  };

  return (
    <div className="signup-user-page">
      {/* =================================================
          THEME BUTTON
      ================================================= */}

      <button
        type="button"
        className="signup-user-theme"
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

      <main className="signup-user-container">
        {/* =================================================
            BACK
        ================================================= */}

        <Link to="/signup" className="signup-user-back">
          <ArrowLeft size={14} />
          Account Type
        </Link>

        {/* =================================================
            HEADING
        ================================================= */}

        <div className="signup-user-heading">
          <span>USER ACCOUNT</span>

          <h1>
            Create your <em>account.</em>
          </h1>

          <p>Enter your details to create your Pustakalaya account.</p>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && <div className="signup-user-alert error">{error}</div>}

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && <div className="signup-user-alert success">{success}</div>}

        {/* =================================================
            FORM
        ================================================= */}

        <form className="signup-user-form" onSubmit={handleSubmit}>
          {/* =================================================
              ACCOUNT TYPE
          ================================================= */}

          <div className="signup-user-account-type">
            <label>Account Type *</label>

            <div className="signup-user-type-grid">
              {/* STUDENT */}

              <button
                type="button"
                className={
                  accountType === "Student"
                    ? "signup-user-type-option selected"
                    : "signup-user-type-option"
                }
                onClick={() => handleAccountType("Student")}
              >
                <GraduationCap size={18} />

                <span>Student</span>
              </button>

              {/* TEACHER */}

              <button
                type="button"
                className={
                  accountType === "Teacher"
                    ? "signup-user-type-option selected"
                    : "signup-user-type-option"
                }
                onClick={() => handleAccountType("Teacher")}
              >
                <Building2 size={18} />

                <span>Professor</span>
              </button>
            </div>
          </div>

          {/* =================================================
              FULL NAME
          ================================================= */}

          <div className="signup-user-field full">
            <label>Full Name *</label>

            <div className="signup-user-input">
              <UserRound size={17} />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="signup-user-field">
            <label>Email Address *</label>

            <div className="signup-user-input">
              <Mail size={17} />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@college.edu"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* =================================================
              PHONE
          ================================================= */}

          <div className="signup-user-field">
            <label>Phone Number *</label>

            <div className="signup-user-input">
              <Phone size={17} />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                maxLength="10"
                autoComplete="tel"
                required
              />
            </div>
          </div>

          {/* =================================================
              STUDENT ONLY
          ================================================= */}

          {accountType === "Student" && (
            <>
              {/* COURSE */}

              <div className="signup-user-field">
                <label>Course *</label>

                <div className="signup-user-input">
                  <GraduationCap size={17} />

                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech CSE"
                    required
                  />
                </div>
              </div>

              {/* SEMESTER */}

              <div className="signup-user-field">
                <label>Semester *</label>

                <div className="signup-user-input">
                  <GraduationCap size={17} />

                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select semester</option>

                    <option value="1st Semester">1st Semester</option>

                    <option value="2nd Semester">2nd Semester</option>

                    <option value="3rd Semester">3rd Semester</option>

                    <option value="4th Semester">4th Semester</option>

                    <option value="5th Semester">5th Semester</option>

                    <option value="6th Semester">6th Semester</option>

                    <option value="7th Semester">7th Semester</option>

                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* =================================================
              TEACHER ONLY — DESIGNATION
          ================================================= */}

          {accountType === "Teacher" && (
            <div className="signup-user-field">
              <label>Designation *</label>

              <div className="signup-user-input">
                <Building2 size={17} />

                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Assistant Professor"
                  required
                />
              </div>
            </div>
          )}

          {/* =================================================
              DEPARTMENT — BOTH
          ================================================= */}

          <div className="signup-user-field">
            <label>Department *</label>

            <div className="signup-user-input">
              <Building2 size={17} />

              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                required
              />
            </div>
          </div>

          {/* =================================================
              TEACHER ONLY — EMPLOYEE ID
          ================================================= */}

          {accountType === "Teacher" && (
            <div className="signup-user-field">
              <label>Employee ID *</label>

              <div className="signup-user-input">
                <UserRound size={17} />

                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="College employee ID"
                  required
                />
              </div>
            </div>
          )}

          {/* =================================================
              LIBRARY REGISTRATION — BOTH
          ================================================= */}

          <div className="signup-user-field">
            <label>Library Registration No. *</label>

            <div className="signup-user-input">
              <Library size={17} />

              <input
                type="text"
                name="libraryRegNo"
                value={formData.libraryRegNo}
                onChange={handleChange}
                placeholder="Library registration number"
                required
              />
            </div>
          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="signup-user-field">
            <label>Password *</label>

            <div className="signup-user-input">
              <LockKeyhole size={17} />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                minLength="6"
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="signup-user-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* =================================================
              CONFIRM PASSWORD
          ================================================= */}

          <div className="signup-user-field">
            <label>Confirm Password *</label>

            <div className="signup-user-input">
              <LockKeyhole size={17} />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="signup-user-eye"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* =================================================
              TERMS
          ================================================= */}

          <label className="signup-user-terms">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />

            <span>I agree to the library terms and conditions.</span>
          </label>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <button type="submit" className="signup-user-submit">
            Create User Account
            <ArrowRight size={16} />
          </button>
        </form>

        {/* =================================================
            LOGIN
        ================================================= */}

        <div className="signup-user-login">
          <span>Already have an account?</span>

          <Link to="/login">Sign In</Link>
        </div>
      </main>
    </div>
  );
}

export default SignupUser;
