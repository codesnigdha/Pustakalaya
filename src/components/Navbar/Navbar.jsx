import {
  BookOpen,
  Menu,
  Moon,
  Sun,
  X,
  UserRound,
  Settings,
  Bell,
  Pencil,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import { Link, NavLink, useNavigate } from "react-router-dom";

import { useState } from "react";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const { user, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  /* =====================================================
     CLOSE MOBILE MENU
  ===================================================== */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* =====================================================
     CLOSE PROFILE DROPDOWN
  ===================================================== */

  const closeProfile = () => {
    setProfileOpen(false);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    logout();

    setProfileOpen(false);
    setMenuOpen(false);

    navigate("/");
  };

  /* =====================================================
     USER INITIAL
  ===================================================== */

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* =================================================
            LOGO
        ================================================= */}

        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="navbar-logo-icon">
            <BookOpen size={24} />
          </div>

          <div className="navbar-logo-text">
            <span>PUSTAKALAYA</span>

            <small>Campus Library</small>
          </div>
        </Link>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className={`navbar-links ${menuOpen ? "navbar-links-open" : ""}`}>
          <NavLink to="/" end className="navbar-link" onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/books" className="navbar-link" onClick={closeMenu}>
            Browse Books
          </NavLink>

          <NavLink to="/about" className="navbar-link" onClick={closeMenu}>
            About
          </NavLink>

          <NavLink to="/contact" className="navbar-link" onClick={closeMenu}>
            Contact
          </NavLink>

          {/* =================================================
              MOBILE AUTHENTICATION
          ================================================= */}

          <div className="navbar-mobile-auth">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="navbar-login-btn"
                  onClick={closeMenu}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="navbar-signup-btn"
                  onClick={closeMenu}
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="navbar-mobile-profile"
                  onClick={closeMenu}
                >
                  <UserRound size={15} />
                  Profile
                </Link>

                <button
                  type="button"
                  className="navbar-mobile-logout"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>

        {/* =================================================
            RIGHT ACTIONS
        ================================================= */}

        <div className="navbar-actions">
          {/* =================================================
              LOGGED OUT
          ================================================= */}

          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="navbar-login-btn navbar-desktop-auth"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="navbar-signup-btn navbar-desktop-auth"
              >
                Get Started
              </Link>
            </>
          )}

          {/* =================================================
              LOGGED IN
          ================================================= */}

          {isAuthenticated && (
            <>
              {/* ================= DASHBOARD ================= */}

              <NavLink to="/dashboard" className="navbar-dashboard-btn">
                <LayoutDashboard size={15} />

                <span>Dashboard</span>
              </NavLink>

              {/* ================= PROFILE ================= */}

              <div
                className={`navbar-profile ${
                  profileOpen ? "navbar-profile-open" : ""
                }`}
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}
              >
                {/* Profile Button */}

                <button
                  type="button"
                  className="navbar-profile-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-label="Open profile menu"
                >
                  <div className="navbar-profile-avatar">{userInitial}</div>

                  <div className="navbar-profile-info">
                    <span>{user?.name || "User"}</span>

                    <small>{user?.role || "Member"}</small>
                  </div>
                </button>

                {/* =================================================
                    PROFILE DROPDOWN
                ================================================= */}

                <div className="navbar-profile-dropdown">
                  {/* Dropdown Header */}

                  <div className="navbar-dropdown-header">
                    <div className="navbar-dropdown-avatar">{userInitial}</div>

                    <div>
                      <strong>{user?.name || "User"}</strong>

                      <span>{user?.email || ""}</span>
                    </div>
                  </div>

                  <div className="navbar-dropdown-divider"></div>

                  {/* Edit Profile */}

                  <Link
                    to="/profile"
                    className="navbar-dropdown-item"
                    onClick={closeProfile}
                  >
                    <div>
                      <Pencil size={16} />
                    </div>

                    <span>Edit Profile</span>
                  </Link>

                  {/* Settings */}

                  <Link
                    to="/settings"
                    className="navbar-dropdown-item"
                    onClick={closeProfile}
                  >
                    <div>
                      <Settings size={16} />
                    </div>

                    <span>Settings</span>
                  </Link>

                  {/* Notifications */}

                  <Link
                    to="/notifications"
                    className="navbar-dropdown-item"
                    onClick={closeProfile}
                  >
                    <div>
                      <Bell size={16} />
                    </div>

                    <span>Notifications</span>

                    <span className="navbar-notification-dot">2</span>
                  </Link>

                  <div className="navbar-dropdown-divider"></div>

                  {/* Logout */}

                  <button
                    type="button"
                    className="navbar-dropdown-logout"
                    onClick={handleLogout}
                  >
                    <div>
                      <LogOut size={16} />
                    </div>

                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* =================================================
              THEME BUTTON
          ================================================= */}

          <button
            type="button"
            className="navbar-theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <button
            type="button"
            className="navbar-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
