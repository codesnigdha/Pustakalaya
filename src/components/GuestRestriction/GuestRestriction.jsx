import { BookOpen, Clock3, LogIn, UserPlus, X } from "lucide-react";

import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./GuestRestriction.css";

const GUEST_TIME_LIMIT = 5 * 60 * 1000;

function GuestRestriction() {
  const { isAuthenticated } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  /* =====================================================
     GUEST TIMER
  ===================================================== */

  useEffect(() => {
    if (isAuthenticated) {
      setShowModal(false);
      return;
    }

    let startTime = localStorage.getItem("pustakalaya_guest_start");

    if (!startTime) {
      startTime = Date.now().toString();

      localStorage.setItem("pustakalaya_guest_start", startTime);
    }

    const checkTimer = setInterval(() => {
      const storedStart = Number(
        localStorage.getItem("pustakalaya_guest_start"),
      );

      if (!storedStart) return;

      const elapsed = Date.now() - storedStart;

      if (elapsed >= GUEST_TIME_LIMIT) {
        setShowModal(true);
      }
    }, 1000);

    return () => {
      clearInterval(checkTimer);
    };
  }, [isAuthenticated]);

  /* =====================================================
     PROTECTED PAGES
  ===================================================== */

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    const protectedGuestPages = [
      "/dashboard",
      "/my-books",
      "/wishlist",
      "/profile",
      "/admin",
      "/librarian",
    ];

    const isProtectedPage = protectedGuestPages.some((path) =>
      location.pathname.startsWith(path),
    );

    if (isProtectedPage) {
      setShowModal(true);
    }
  }, [location.pathname, isAuthenticated]);

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleLogin = () => {
    setShowModal(false);

    navigate("/login", {
      state: {
        from: location.pathname,
      },
    });
  };

  /* =====================================================
     SIGNUP
  ===================================================== */

  const handleSignup = () => {
    setShowModal(false);

    navigate("/signup", {
      state: {
        from: location.pathname,
      },
    });
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const handleClose = () => {
    setShowModal(false);
  };

  /* =====================================================
     DON'T RENDER
  ===================================================== */

  if (!showModal || isAuthenticated) {
    return null;
  }

  return (
    <div className="guest-restriction-overlay">
      <div
        className="guest-restriction-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= CLOSE ================= */}

        <button
          type="button"
          className="guest-restriction-close"
          onClick={handleClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* ================= ICON ================= */}

        <div className="guest-restriction-icon">
          <Clock3 size={25} />
        </div>

        {/* ================= LABEL ================= */}

        <span className="guest-restriction-label">MEMBER ACCESS</span>

        {/* ================= HEADING ================= */}

        <h2>
          Continue Your
          <em> Library Journey.</em>
        </h2>

        {/* ================= DESCRIPTION ================= */}

        <p>
          You've been exploring Pustakalaya as a guest. Create an account or
          sign in to continue accessing your personalized library features.
        </p>

        {/* ================= BENEFITS ================= */}

        <div className="guest-restriction-benefits">
          <div>
            <BookOpen size={15} />

            <span>Borrow & reserve books</span>
          </div>

          <div>
            <BookOpen size={15} />

            <span>Manage your wishlist</span>
          </div>

          <div>
            <BookOpen size={15} />

            <span>Track your library activity</span>
          </div>
        </div>

        {/* ================= ACTIONS ================= */}

        <div className="guest-restriction-actions">
          <button type="button" className="guest-login" onClick={handleLogin}>
            <LogIn size={16} />

            <span>Login</span>
          </button>

          <button type="button" className="guest-signup" onClick={handleSignup}>
            <UserPlus size={16} />

            <span>Create Account</span>
          </button>
        </div>

        {/* ================= CONTINUE ================= */}

        <button type="button" className="guest-continue" onClick={handleClose}>
          Continue Browsing
        </button>
      </div>
    </div>
  );
}

export default GuestRestriction;
