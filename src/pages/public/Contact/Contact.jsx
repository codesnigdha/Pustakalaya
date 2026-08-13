import {
  BookOpen,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* =====================================================
     HANDLE INPUT
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
     HANDLE SUBMIT
  ===================================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.subject.trim()) {
      setError("Please enter a subject.");
      return;
    }

    if (!formData.message.trim()) {
      setError("Please enter your message.");
      return;
    }

    /* =================================================
       SAVE MESSAGE TO LOCAL STORAGE
    ================================================= */

    const existingMessages =
      JSON.parse(localStorage.getItem("pustakalaya_contact_messages")) || [];

    const newMessage = {
      id: Date.now(),

      name: formData.name.trim(),

      email: formData.email.trim(),

      subject: formData.subject.trim(),

      message: formData.message.trim(),

      date: new Date().toLocaleString(),

      status: "New",
    };

    localStorage.setItem(
      "pustakalaya_contact_messages",
      JSON.stringify([...existingMessages, newMessage]),
    );

    setSuccess(
      "Your message has been sent successfully. Our library team will get back to you soon.",
    );

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">
      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="contact-main">
        <div className="contact-container">
          {/* =================================================
              HERO
          ================================================= */}

          <section className="contact-hero">
            <span className="contact-hero-label">GET IN TOUCH</span>

            <h1>
              Let's Talk About
              <em> Your Library.</em>
            </h1>

            <p>
              Have a question about books, library services, your account or
              anything related to Pustakalaya? We're here to help.
            </p>
          </section>

          {/* =================================================
              CONTACT CONTENT
          ================================================= */}

          <section className="contact-grid">
            {/* =================================================
                LEFT INFORMATION
            ================================================= */}

            <div className="contact-information">
              <div className="contact-info-heading">
                <span>CONTACT INFORMATION</span>

                <h2>We're here to help.</h2>

                <p>
                  Reach out to the college library team through any of the
                  channels below.
                </p>
              </div>

              {/* Email */}

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Mail size={19} />
                </div>

                <div>
                  <span>Email</span>

                  <a href="mailto:library@college.edu">library@college.edu</a>
                </div>
              </div>

              {/* Phone */}

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Phone size={19} />
                </div>

                <div>
                  <span>Phone</span>

                  <a href="tel:+911234567890">+91 12345 67890</a>
                </div>
              </div>

              {/* Location */}

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <MapPin size={19} />
                </div>

                <div>
                  <span>Library Location</span>

                  <p>College Central Library, Main Academic Building</p>
                </div>
              </div>

              {/* Hours */}

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Clock3 size={19} />
                </div>

                <div>
                  <span>Library Hours</span>

                  <p>Monday – Friday: 9:00 AM – 6:00 PM</p>

                  <p>Saturday: 9:00 AM – 2:00 PM</p>
                </div>
              </div>

              {/* Library Card */}

              <div className="contact-library-card">
                <div className="contact-library-icon">
                  <BookOpen size={22} />
                </div>

                <div>
                  <span>PUSTAKALAYA</span>

                  <h3>Your campus, your library.</h3>

                  <Link to="/books">
                    Explore Books
                    <Send size={13} />
                  </Link>
                </div>
              </div>
            </div>

            {/* =================================================
                CONTACT FORM
            ================================================= */}

            <div className="contact-form-card">
              <div className="contact-form-heading">
                <div className="contact-form-heading-icon">
                  <MessageSquare size={19} />
                </div>

                <div>
                  <span>SEND A MESSAGE</span>

                  <h2>How can we help?</h2>
                </div>
              </div>

              {/* Error */}

              {error && (
                <div className="contact-alert contact-alert-error">
                  <AlertCircle size={16} />

                  <span>{error}</span>
                </div>
              )}

              {/* Success */}

              {success && (
                <div className="contact-alert contact-alert-success">
                  <CheckCircle2 size={16} />

                  <span>{success}</span>
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                {/* Name + Email */}

                <div className="contact-form-row">
                  <div className="contact-field">
                    <label htmlFor="name">Full Name</label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="email">Email Address</label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Subject */}

                <div className="contact-field">
                  <label htmlFor="subject">Subject</label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What would you like to ask?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                {/* Message */}

                <div className="contact-field">
                  <label htmlFor="message">Message</label>

                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                {/* Submit */}

                <button type="submit" className="contact-submit-btn">
                  Send Message
                  <Send size={16} />
                </button>
              </form>

              <p className="contact-form-note">
                Your message will be securely stored and can be reviewed by the
                library administrator.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
