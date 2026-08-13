import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Bell,
  Mail,
  Globe,
  UserRound,
  Save,
  RotateCcw,
  LogOut,
  CheckCircle2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";

import "./Settings.css";

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  libraryNotifications: true,
  dueDateReminder: true,
  language: "English",
};

function Settings() {
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  const { logout } = useAuth();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [saved, setSaved] = useState(false);

  /* =====================================================
     LOAD SETTINGS
  ===================================================== */

  useEffect(() => {
    const storedSettings = JSON.parse(
      localStorage.getItem("pustakalaya_settings"),
    );

    if (storedSettings) {
      setSettings({
        ...DEFAULT_SETTINGS,
        ...storedSettings,
      });
    }
  }, []);

  /* =====================================================
     CHANGE SETTING
  ===================================================== */

  const handleChange = (name, value) => {
    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  /* =====================================================
     SAVE SETTINGS
  ===================================================== */

  const handleSave = () => {
    localStorage.setItem("pustakalaya_settings", JSON.stringify(settings));

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  /* =====================================================
     RESET SETTINGS
  ===================================================== */

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Reset all settings to their default values?",
    );

    if (!confirmReset) return;

    setSettings(DEFAULT_SETTINGS);

    localStorage.setItem(
      "pustakalaya_settings",
      JSON.stringify(DEFAULT_SETTINGS),
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  return (
    <div className="settings-page">
      <Navbar />

      <main className="settings-main">
        <div className="settings-container">
          {/* =================================================
              HEADER
          ================================================= */}

          <section className="settings-header">
            <div>
              <span className="settings-label">PREFERENCES</span>

              <h1>
                Account
                <em> Settings.</em>
              </h1>

              <p>
                Customize your Pustakalaya experience and notification
                preferences.
              </p>
            </div>

            <div className="settings-header-icon">
              <SettingsIcon size={30} />
            </div>
          </section>

          {/* =================================================
              SAVE MESSAGE
          ================================================= */}

          {saved && (
            <div className="settings-saved">
              <CheckCircle2 size={16} />

              <span>Settings saved successfully.</span>
            </div>
          )}

          {/* =================================================
              SETTINGS LAYOUT
          ================================================= */}

          <div className="settings-layout">
            {/* =================================================
                APPEARANCE
            ================================================= */}

            <section className="settings-section">
              <div className="settings-section-header">
                <div className="settings-section-icon">
                  <Sun size={17} />
                </div>

                <div>
                  <span>APPEARANCE</span>

                  <h2>Theme</h2>
                </div>
              </div>

              <p className="settings-description">
                Choose how Pustakalaya looks on your device.
              </p>

              <div className="settings-theme-options">
                {/* Light */}

                <button
                  type="button"
                  className={`settings-theme-option ${
                    theme === "light" ? "active" : ""
                  }`}
                  onClick={() => {
                    if (theme !== "light") {
                      toggleTheme();
                    }
                  }}
                >
                  <div className="settings-theme-icon">
                    <Sun size={20} />
                  </div>

                  <div>
                    <strong>Light Mode</strong>

                    <span>Clean and bright</span>
                  </div>
                </button>

                {/* Dark */}

                <button
                  type="button"
                  className={`settings-theme-option ${
                    theme === "dark" ? "active" : ""
                  }`}
                  onClick={() => {
                    if (theme !== "dark") {
                      toggleTheme();
                    }
                  }}
                >
                  <div className="settings-theme-icon">
                    <Moon size={20} />
                  </div>

                  <div>
                    <strong>Dark Mode</strong>

                    <span>Easy on the eyes</span>
                  </div>
                </button>
              </div>
            </section>

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <section className="settings-section">
              <div className="settings-section-header">
                <div className="settings-section-icon">
                  <Bell size={17} />
                </div>

                <div>
                  <span>NOTIFICATIONS</span>

                  <h2>Notification Preferences</h2>
                </div>
              </div>

              <div className="settings-options">
                {/* Email */}

                <div className="settings-option">
                  <div className="settings-option-left">
                    <div className="settings-option-icon">
                      <Mail size={16} />
                    </div>

                    <div>
                      <strong>Email Notifications</strong>

                      <span>Receive important library updates by email.</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`settings-toggle ${
                      settings.emailNotifications ? "active" : ""
                    }`}
                    onClick={() =>
                      handleChange(
                        "emailNotifications",
                        !settings.emailNotifications,
                      )
                    }
                    aria-label="Toggle email notifications"
                  >
                    <span></span>
                  </button>
                </div>

                {/* Library */}

                <div className="settings-option">
                  <div className="settings-option-left">
                    <div className="settings-option-icon">
                      <Bell size={16} />
                    </div>

                    <div>
                      <strong>Library Notifications</strong>

                      <span>Get updates about your borrowed books.</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`settings-toggle ${
                      settings.libraryNotifications ? "active" : ""
                    }`}
                    onClick={() =>
                      handleChange(
                        "libraryNotifications",
                        !settings.libraryNotifications,
                      )
                    }
                    aria-label="Toggle library notifications"
                  >
                    <span></span>
                  </button>
                </div>

                {/* Due Date */}

                <div className="settings-option">
                  <div className="settings-option-left">
                    <div className="settings-option-icon">
                      <Bell size={16} />
                    </div>

                    <div>
                      <strong>Due Date Reminders</strong>

                      <span>Get reminders before a book becomes overdue.</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`settings-toggle ${
                      settings.dueDateReminder ? "active" : ""
                    }`}
                    onClick={() =>
                      handleChange("dueDateReminder", !settings.dueDateReminder)
                    }
                    aria-label="Toggle due date reminders"
                  >
                    <span></span>
                  </button>
                </div>
              </div>
            </section>

            {/* =================================================
                LANGUAGE
            ================================================= */}

            <section className="settings-section">
              <div className="settings-section-header">
                <div className="settings-section-icon">
                  <Globe size={17} />
                </div>

                <div>
                  <span>LANGUAGE</span>

                  <h2>Display Language</h2>
                </div>
              </div>

              <div className="settings-language">
                <div className="settings-language-label">
                  <Globe size={16} />

                  <span>Language</span>
                </div>

                <select
                  value={settings.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                >
                  <option value="English">English</option>

                  <option value="Hindi">Hindi</option>

                  <option value="Bengali">Bengali</option>
                </select>
              </div>
            </section>

            {/* =================================================
                ACCOUNT
            ================================================= */}

            <section className="settings-section">
              <div className="settings-section-header">
                <div className="settings-section-icon">
                  <UserRound size={17} />
                </div>

                <div>
                  <span>ACCOUNT</span>

                  <h2>Account Actions</h2>
                </div>
              </div>

              <div className="settings-account-actions">
                <button
                  type="button"
                  className="settings-reset-btn"
                  onClick={handleReset}
                >
                  <RotateCcw size={15} />
                  Reset Settings
                </button>

                <button
                  type="button"
                  className="settings-logout-btn"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </section>
          </div>

          {/* =================================================
              BOTTOM ACTIONS
          ================================================= */}

          <div className="settings-bottom-actions">
            <button
              type="button"
              className="settings-save-btn"
              onClick={handleSave}
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Settings;
