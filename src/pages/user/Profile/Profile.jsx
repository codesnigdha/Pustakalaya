import {
  UserRound,
  Pencil,
  Mail,
  Phone,
  CalendarDays,
  GraduationCap,
  IdCard,
  Save,
  X,
  LogOut,
  BookOpen,
  Heart,
  IndianRupee,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import { useAuth } from "../../../context/AuthContext";

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    department: "",
    memberId: "",
    role: "Student",
  });

  const [formData, setFormData] = useState(profile);

  /* =====================================================
     LOAD PROFILE
  ===================================================== */

  useEffect(() => {
    const storedProfile = JSON.parse(
      localStorage.getItem("pustakalaya_profile"),
    );

    if (storedProfile) {
      setProfile(storedProfile);
      setFormData(storedProfile);

      return;
    }

    const initialProfile = {
      name: user?.name || "Library Member",

      email: user?.email || "student@example.com",

      age: user?.age || "20",

      phone: user?.phone || "+91 98765 43210",

      department: user?.department || "Computer Science & Engineering",

      memberId: user?.memberId || "PUS2026001",

      role: user?.role || "Student",
    };

    localStorage.setItem("pustakalaya_profile", JSON.stringify(initialProfile));

    setProfile(initialProfile);
    setFormData(initialProfile);
  }, [user]);

  /* =====================================================
     CHANGE INPUT
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    localStorage.setItem("pustakalaya_profile", JSON.stringify(formData));

    /*
     * Update the auth user data as well
     * if it exists in LocalStorage.
     */

    const storedUser = JSON.parse(
      localStorage.getItem("pustakalaya_current_user"),
    );

    if (storedUser) {
      const updatedUser = {
        ...storedUser,
        name: formData.name,
        email: formData.email,
        age: formData.age,
        phone: formData.phone,
        department: formData.department,
        memberId: formData.memberId,
        role: formData.role,
      };

      localStorage.setItem(
        "pustakalaya_current_user",
        JSON.stringify(updatedUser),
      );
    }

    setProfile(formData);

    setIsEditing(false);

    alert("Profile updated successfully.");
  };

  /* =====================================================
     CANCEL
  ===================================================== */

  const handleCancel = () => {
    setFormData(profile);

    setIsEditing(false);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  /* =====================================================
     INITIAL
  ===================================================== */

  const userInitial = profile.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-main">
        <div className="profile-container">
          {/* =================================================
              HEADER
          ================================================= */}

          <section className="profile-header">
            <div>
              <span className="profile-label">ACCOUNT</span>

              <h1>
                My
                <em> Profile.</em>
              </h1>

              <p>
                Manage your personal information and library membership details.
              </p>
            </div>

            {!isEditing && (
              <button
                type="button"
                className="profile-edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <Pencil size={15} />
                Edit Profile
              </button>
            )}
          </section>

          {/* =================================================
              PROFILE LAYOUT
          ================================================= */}

          <section className="profile-layout">
            {/* =================================================
                LEFT PROFILE CARD
            ================================================= */}

            <aside className="profile-sidebar">
              <div className="profile-avatar">{userInitial}</div>

              <h2>{profile.name || "Library Member"}</h2>

              <span className="profile-role">{profile.role}</span>

              <div className="profile-member-id">
                <IdCard size={14} />

                <span>{profile.memberId}</span>
              </div>

              <div className="profile-sidebar-divider"></div>

              <div className="profile-sidebar-stat">
                <div>
                  <BookOpen size={15} />
                </div>

                <span>My Books</span>

                <strong>0</strong>
              </div>

              <div className="profile-sidebar-stat">
                <div>
                  <Heart size={15} />
                </div>

                <span>Wishlist</span>

                <strong>0</strong>
              </div>

              <div className="profile-sidebar-stat">
                <div>
                  <IndianRupee size={15} />
                </div>

                <span>Outstanding Fine</span>

                <strong>₹0</strong>
              </div>

              <button
                type="button"
                className="profile-logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={15} />
                Logout
              </button>
            </aside>

            {/* =================================================
                RIGHT CONTENT
            ================================================= */}

            <div className="profile-content">
              {/* =================================================
                  PERSONAL INFORMATION
              ================================================= */}

              <section className="profile-section">
                <div className="profile-section-header">
                  <div>
                    <span>PERSONAL INFORMATION</span>

                    <h3>Basic Details</h3>
                  </div>

                  <UserRound size={19} />
                </div>

                <div className="profile-fields">
                  {/* Name */}

                  <div className="profile-field">
                    <label>Full Name</label>

                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                      />
                    ) : (
                      <div className="profile-field-value">
                        <UserRound size={15} />

                        <span>{profile.name || "—"}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}

                  <div className="profile-field">
                    <label>Email Address</label>

                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="profile-field-value">
                        <Mail size={15} />

                        <span>{profile.email || "—"}</span>
                      </div>
                    )}
                  </div>

                  {/* Age */}

                  <div className="profile-field">
                    <label>Age</label>

                    {isEditing ? (
                      <input
                        type="number"
                        name="age"
                        min="1"
                        max="100"
                        value={formData.age}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="profile-field-value">
                        <CalendarDays size={15} />

                        <span>{profile.age || "—"} years</span>
                      </div>
                    )}
                  </div>

                  {/* Phone */}

                  <div className="profile-field">
                    <label>Phone Number</label>

                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    ) : (
                      <div className="profile-field-value">
                        <Phone size={15} />

                        <span>{profile.phone || "—"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* =================================================
                  ACADEMIC INFORMATION
              ================================================= */}

              <section className="profile-section">
                <div className="profile-section-header">
                  <div>
                    <span>ACADEMIC INFORMATION</span>

                    <h3>College Details</h3>
                  </div>

                  <GraduationCap size={20} />
                </div>

                <div className="profile-fields">
                  {/* Role */}

                  <div className="profile-field">
                    <label>Account Type</label>

                    {isEditing ? (
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="Student">Student</option>

                        <option value="Teacher">Teacher</option>
                      </select>
                    ) : (
                      <div className="profile-field-value">
                        <GraduationCap size={15} />

                        <span>{profile.role}</span>
                      </div>
                    )}
                  </div>

                  {/* Department */}

                  <div className="profile-field">
                    <label>Department</label>

                    {isEditing ? (
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="Your department"
                      />
                    ) : (
                      <div className="profile-field-value">
                        <BookOpen size={15} />

                        <span>{profile.department || "—"}</span>
                      </div>
                    )}
                  </div>

                  {/* Member ID */}

                  <div className="profile-field">
                    <label>Library Member ID</label>

                    <div className="profile-field-value profile-readonly">
                      <IdCard size={15} />

                      <span>{profile.memberId || "—"}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* =================================================
                  EDIT ACTIONS
              ================================================= */}

              {isEditing && (
                <div className="profile-edit-actions">
                  <button
                    type="button"
                    className="profile-cancel-btn"
                    onClick={handleCancel}
                  >
                    <X size={15} />
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="profile-save-btn"
                    onClick={handleSave}
                  >
                    <Save size={15} />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;
