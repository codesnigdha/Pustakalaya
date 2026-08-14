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

import { signupUser } from "../../../services/authService";
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

  const [loading, setLoading] = useState(false);

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
     COURSE OPTIONS
  ===================================================== */

  const courseOptions = [
    "B.Tech",
    "BCA",
    "MCA",
    "M.Tech",
    "B.Sc",
    "M.Sc",
    "BBA",
    "MBA",
    "B.Com",
    "M.Com",
  ];

  /* =====================================================
     DEPARTMENT OPTIONS
  ===================================================== */

  const departmentOptions = [
    "Computer Science & Engineering",
    "Information Technology",
    "Electronics & Communication Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Artificial Intelligence & Machine Learning",
    "Data Science",
    "Business Administration",
    "Commerce",
    "Mathematics",
    "Physics",
    "Chemistry",
    "English",
  ];

  /* =====================================================
     DESIGNATION OPTIONS
  ===================================================== */

  const designationOptions = [
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "Senior Professor",
    "Lecturer",
    "Head of Department",
    "Dean",
  ];

  /* =====================================================
     HANDLE INPUT CHANGE
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
     HANDLE ACCOUNT TYPE
  ===================================================== */

  const handleAccountType = (type) => {
    setAccountType(type);

    /*
      Clear account-type-specific fields.
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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
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
      if (!formData.course) {
        return "Please select your course.";
      }

      if (!formData.semester) {
        return "Please select your semester.";
      }
    }

    /* =================================================
       TEACHER DETAILS
    ================================================= */

    if (accountType === "Teacher") {
      if (!formData.designation) {
        return "Please select your designation.";
      }

      if (!formData.employeeId.trim()) {
        return "Please enter your employee ID.";
      }
    }

    /* =================================================
       DEPARTMENT
    ================================================= */

    if (!formData.department) {
      return "Please select your department.";
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

  const handleSubmit = async (e) => {
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

    setLoading(true);

    try {
      /* =================================================
         ROLE
      ================================================= */

      const role = accountType === "Student" ? "STUDENT" : "TEACHER";

      /* =================================================
         DATA FOR SPRING BOOT
         
         IMPORTANT:
         confirmPassword is NOT sent.
         
         libraryRegNo is converted to the
         backend field libraryRegistrationNumber.
      ================================================= */

      const userData = {
        name: formData.name.trim(),

        email: formData.email.trim().toLowerCase(),

        phone: formData.phone.trim(),

        department: formData.department,

        course: accountType === "Student" ? formData.course : null,

        semester:
          accountType === "Student"
            ? Number(formData.semester.replace(/\D/g, ""))
            : null,

        libraryRegistrationNumber: formData.libraryRegNo.trim(),

        employeeId:
          accountType === "Teacher" ? formData.employeeId.trim() : null,

        designation: accountType === "Teacher" ? formData.designation : null,

        password: formData.password,

        role: role,
      };

      console.log("Sending user signup data:", userData);

      /* =================================================
         BACKEND API
      ================================================= */

      const result = await signupUser(userData);

      console.log("Signup successful:", result);

      /* =================================================
         SUCCESS
      ================================================= */

      setSuccess("Account created successfully. Redirecting to login...");

      /* =================================================
         REDIRECT
      ================================================= */

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Signup failed:", error);

      setError(error.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     UI
  ===================================================== */

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
        aria-label="Toggle theme"
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
                disabled={loading}
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
                disabled={loading}
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
            <label htmlFor="name">Full Name *</label>

            <div className="signup-user-input">
              <UserRound size={17} />

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="signup-user-field">
            <label htmlFor="email">Email Address *</label>

            <div className="signup-user-input">
              <Mail size={17} />

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@college.edu"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* =================================================
              PHONE
          ================================================= */}

          <div className="signup-user-field">
            <label htmlFor="phone">Phone Number *</label>

            <div className="signup-user-input">
              <Phone size={17} />

              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="10-digit phone number"
                maxLength={10}
                inputMode="numeric"
                autoComplete="tel"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* =================================================
              STUDENT ONLY
          ================================================= */}

          {accountType === "Student" && (
            <>
              {/* =================================================
                  COURSE DROPDOWN
              ================================================= */}

              <div className="signup-user-field">
                <label htmlFor="course">Course *</label>

                <div className="signup-user-input">
                  <GraduationCap size={17} />

                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select course</option>

                    {courseOptions.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* =================================================
                  SEMESTER DROPDOWN
              ================================================= */}

              <div className="signup-user-field">
                <label htmlFor="semester">Semester *</label>

                <div className="signup-user-input">
                  <GraduationCap size={17} />

                  <select
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select semester</option>

                    <option value="1">1st Semester</option>

                    <option value="2">2nd Semester</option>

                    <option value="3">3rd Semester</option>

                    <option value="4">4th Semester</option>

                    <option value="5">5th Semester</option>

                    <option value="6">6th Semester</option>

                    <option value="7">7th Semester</option>

                    <option value="8">8th Semester</option>
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
              <label htmlFor="designation">Designation *</label>

              <div className="signup-user-input">
                <Building2 size={17} />

                <select
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
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
          )}

          {/* =================================================
              DEPARTMENT — BOTH
          ================================================= */}

          <div className="signup-user-field">
            <label htmlFor="department">Department *</label>

            <div className="signup-user-input">
              <Building2 size={17} />

              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select department</option>

                {departmentOptions.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* =================================================
              TEACHER ONLY — EMPLOYEE ID
          ================================================= */}

          {accountType === "Teacher" && (
            <div className="signup-user-field">
              <label htmlFor="employeeId">Employee ID *</label>

              <div className="signup-user-input">
                <UserRound size={17} />

                <input
                  id="employeeId"
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="College employee ID"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* =================================================
              LIBRARY REGISTRATION — BOTH
          ================================================= */}

          <div className="signup-user-field">
            <label htmlFor="libraryRegNo">Library Registration No. *</label>

            <div className="signup-user-input">
              <Library size={17} />

              <input
                id="libraryRegNo"
                type="text"
                name="libraryRegNo"
                value={formData.libraryRegNo}
                onChange={handleChange}
                placeholder="Library registration number"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="signup-user-field">
            <label htmlFor="password">Password *</label>

            <div className="signup-user-input">
              <LockKeyhole size={17} />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                minLength={6}
                autoComplete="new-password"
                required
                disabled={loading}
              />

              <button
                type="button"
                className="signup-user-eye"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* =================================================
              CONFIRM PASSWORD
          ================================================= */}

          <div className="signup-user-field">
            <label htmlFor="confirmPassword">Confirm Password *</label>

            <div className="signup-user-input">
              <LockKeyhole size={17} />

              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                autoComplete="new-password"
                required
                disabled={loading}
              />

              <button
                type="button"
                className="signup-user-eye"
                onClick={() => setShowConfirmPassword((previous) => !previous)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                disabled={loading}
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
              disabled={loading}
            />

            <span>I agree to the library terms and conditions.</span>
          </label>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="submit"
            className="signup-user-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create User Account"}

            {!loading && <ArrowRight size={16} />}
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
