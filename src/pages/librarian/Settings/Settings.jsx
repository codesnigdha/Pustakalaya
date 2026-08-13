import { Bell, LockKeyhole, Moon, Save, Sun, UserRound } from "lucide-react";

import { useState } from "react";

import { useTheme } from "../../../context/ThemeContext";

import "./Settings.css";

function Settings() {
  const { theme, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState(true);

  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setSaved(false);
  };

  const saveSettings = (e) => {
    e.preventDefault();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="lib-settings-page">
      <div className="lib-page-header">
        <div>
          <span>ACCOUNT PREFERENCES</span>

          <h1>Settings</h1>

          <p>Manage your librarian account and preferences.</p>
        </div>
      </div>

      <div className="lib-settings-grid">
        {/* Profile */}

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

          <form onSubmit={saveSettings}>
            <div className="lib-settings-field">
              <label>Full Name</label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Librarian name"
              />
            </div>

            <div className="lib-settings-field">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="library@college.edu"
              />
            </div>

            <div className="lib-settings-field">
              <label>Phone Number</label>

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
              />
            </div>

            <button type="submit" className="lib-settings-save">
              <Save size={15} />

              {saved ? "Saved Successfully" : "Save Changes"}
            </button>
          </form>
        </section>

        {/* Preferences */}

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

          {/* Theme */}

          <div className="lib-setting-option">
            <div className="lib-setting-option-icon">
              {theme === "light" ? <Sun size={17} /> : <Moon size={17} />}
            </div>

            <div>
              <strong>Appearance</strong>

              <span>{theme === "light" ? "Light mode" : "Dark mode"}</span>
            </div>

            <button className="lib-setting-action" onClick={toggleTheme}>
              Change
            </button>
          </div>

          {/* Notifications */}

          <div className="lib-setting-option">
            <div className="lib-setting-option-icon">
              <Bell size={17} />
            </div>

            <div>
              <strong>Notifications</strong>

              <span>Receive library alerts</span>
            </div>

            <button
              className={`lib-toggle ${notifications ? "active" : ""}`}
              onClick={() => setNotifications(!notifications)}
            >
              <span />
            </button>
          </div>

          {/* Password */}

          <div className="lib-setting-option">
            <div className="lib-setting-option-icon">
              <LockKeyhole size={17} />
            </div>

            <div>
              <strong>Password</strong>

              <span>Update your account password</span>
            </div>

            <button className="lib-setting-action">Change</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;
