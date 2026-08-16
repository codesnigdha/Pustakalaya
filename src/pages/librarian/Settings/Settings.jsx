import { Bell, LockKeyhole, Moon, Save, Sun, UserRound } from "lucide-react";

import { useEffect, useState } from "react";

import "./Settings.css";

const USER_KEY = "pustakalaya_user";

/* =====================================================
   GET CURRENT USER
===================================================== */

function getCurrentUser() {
  try {
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Unable to read current user:", error);

    return null;
  }
}

/* =====================================================
   SETTINGS
===================================================== */

function Settings() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState(true);

  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark"),
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  /* ===================================================
     LOAD USER
  =================================================== */

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      setError("Unable to find your account. Please log in again.");

      setLoading(false);

      return;
    }

    setUser(currentUser);

    setFormData({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
    });

    setLoading(false);
  }, []);

  /* ===================================================
     INPUT CHANGE
  =================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  /* ===================================================
     SAVE PROFILE
  =================================================== */

  const handleSave = (event) => {
    event.preventDefault();

    try {
      const currentUser = getCurrentUser();

      if (!currentUser) {
        setError("Unable to find your account. Please log in again.");

        return;
      }

      const updatedUser = {
        ...currentUser,

        name: formData.name,

        email: formData.email,

        phone: formData.phone,
      };

      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

      setUser(updatedUser);

      setSaved(true);

      setError("");

      window.dispatchEvent(new Event("storage"));

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("Unable to save settings:", error);

      setError("Unable to save your settings.");
    }
  };

  /* ===================================================
     DARK MODE
  =================================================== */

  const handleThemeChange = () => {
    const newDarkMode = !darkMode;

    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");

      localStorage.setItem("pustakalaya_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");

      localStorage.setItem("pustakalaya_theme", "light");
    }
  };

  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {
    return (
      <div className="lib-settings-page">
        <div className="lib-page-header">
          <div>
            <span>ACCOUNT PREFERENCES</span>

            <h1>Settings</h1>

            <p>Loading your account...</p>
          </div>
        </div>
      </div>
    );
  }

  /* ===================================================
     PAGE
  =================================================== */

  return (
    <div className="lib-settings-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="lib-page-header">
        <div>
          <span>ACCOUNT PREFERENCES</span>

          <h1>Settings</h1>

          <p>Manage your librarian account and preferences.</p>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && <div className="lib-settings-error">{error}</div>}

      {/* =================================================
          SETTINGS GRID
      ================================================= */}

      <div className="lib-settings-grid">
        {/* =================================================
            PROFILE INFORMATION
        ================================================= */}

        <section className="lib-settings-card">
          <div className="lib-settings-heading">
            <div className="lib-settings-heading-icon">
              <UserRound size={17} />
            </div>

            <div>
              <h2>Profile Information</h2>

              <p>Update your account information.</p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            {/* NAME */}

            <div className="lib-settings-field">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            {/* EMAIL */}

            <div className="lib-settings-field">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            {/* PHONE */}

            <div className="lib-settings-field">
              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            {/* SAVE */}

            <button type="submit" className="lib-settings-save">
              <Save size={15} />

              {saved ? "Saved Successfully" : "Save Changes"}
            </button>
          </form>
        </section>

        {/* =================================================
            PREFERENCES
        ================================================= */}

        <section className="lib-settings-card">
          <div className="lib-settings-heading">
            <div className="lib-settings-heading-icon">
              <Bell size={17} />
            </div>

            <div>
              <h2>Preferences</h2>

              <p>Customize your library workspace.</p>
            </div>
          </div>

          {/* =================================================
              APPEARANCE
          ================================================= */}

          <div className="lib-setting-option">
            <div className="lib-setting-option-icon">
              {darkMode ? <Moon size={17} /> : <Sun size={17} />}
            </div>

            <div>
              <strong>Appearance</strong>

              <span>{darkMode ? "Dark mode" : "Light mode"}</span>
            </div>

            <button
              type="button"
              className="lib-setting-action"
              onClick={handleThemeChange}
            >
              Change
            </button>
          </div>

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div className="lib-setting-option">
            <div className="lib-setting-option-icon">
              <Bell size={17} />
            </div>

            <div>
              <strong>Notifications</strong>

              <span>Receive library alerts</span>
            </div>

            <button
              type="button"
              className={`lib-toggle ${notifications ? "active" : ""}`}
              onClick={() => setNotifications((previous) => !previous)}
            >
              <span />
            </button>
          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="lib-setting-option">
            <div className="lib-setting-option-icon">
              <LockKeyhole size={17} />
            </div>

            <div>
              <strong>Password</strong>

              <span>Update your account password</span>
            </div>

            <button
              type="button"
              className="lib-setting-action"
              onClick={() => {
                alert("Password change will be added next.");
              }}
            >
              Change
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;
