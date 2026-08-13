import { ArrowLeft, ShieldAlert } from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import "./Unauthorized.css";

function Unauthorized() {
  return (
    <div className="unauthorized-page">
      <Navbar />

      <main className="unauthorized-main">
        <div className="unauthorized-icon">
          <ShieldAlert size={38} />
        </div>

        <span>ACCESS RESTRICTED</span>

        <h1>
          You Don't Have
          <em> Permission.</em>
        </h1>

        <p>
          Your current account does not have permission to access this section
          of Pustakalaya.
        </p>

        <Link to="/" className="unauthorized-home">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </main>

      <Footer />
    </div>
  );
}

export default Unauthorized;
