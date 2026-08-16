import { ArrowLeft, ShieldAlert, Home } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import { useAuth } from "../../../context/AuthContext";

import "./Unauthorized.css";

function Unauthorized() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  /* =====================================================
     GO BACK
  ===================================================== */

  const handleGoBack = () => {
    /*
     * If browser history has a previous page,
     * go back.
     *
     * Otherwise go to home.
     */
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="unauthorized-page">
      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="unauthorized-main">
        {/* =================================================
            ICON
        ================================================= */}

        <div className="unauthorized-icon">
          <ShieldAlert size={38} />
        </div>

        {/* =================================================
            LABEL
        ================================================= */}

        <span className="unauthorized-label">ACCESS RESTRICTED</span>

        {/* =================================================
            TITLE
        ================================================= */}

        <h1>
          You Don't Have
          <em> Permission.</em>
        </h1>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <p>
          Your current account does not have permission to access this section
          of Pustakalaya.
        </p>

        {/* =================================================
            CURRENT ROLE
        ================================================= */}

        {isAuthenticated && user?.role && (
          <div className="unauthorized-role">
            <span>Your account type</span>

            <strong>
              {user.role === "LIBRARIAN"
                ? "Librarian"
                : user.role === "TEACHER"
                  ? "Teacher"
                  : user.role === "STUDENT"
                    ? "Student"
                    : user.role}
            </strong>
          </div>
        )}

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="unauthorized-actions">
          {/* BACK */}

          <button
            type="button"
            className="unauthorized-back"
            onClick={handleGoBack}
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          {/* HOME */}

          <Link to="/" className="unauthorized-home">
            <Home size={16} />
            Back to Home
          </Link>
        </div>
      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />
    </div>
  );
}

export default Unauthorized;
