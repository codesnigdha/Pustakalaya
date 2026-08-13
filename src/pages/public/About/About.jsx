import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Library,
  Search,
  Users,
  Clock3,
  ShieldCheck,
  Heart,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import "./About.css";

function About() {
  return (
    <div className="about-page">
      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="about-main">
        <div className="about-container">
          {/* =================================================
              HERO
          ================================================= */}

          <section className="about-hero">
            <div className="about-hero-content">
              <span className="about-label">ABOUT PUSTAKALAYA</span>

              <h1>
                Where Knowledge
                <em> Finds You.</em>
              </h1>

              <p>
                Pustakalaya is a modern college library management platform
                designed to make discovering, accessing and managing books
                simpler for students, teachers and library staff.
              </p>

              <div className="about-hero-actions">
                <Link to="/books" className="about-primary-btn">
                  Explore Books
                  <ArrowRight size={15} />
                </Link>

                <Link to="/contact" className="about-secondary-btn">
                  Contact Library
                </Link>
              </div>
            </div>

            <div className="about-hero-visual">
              <div className="about-book-stack">
                <div className="about-book about-book-one">
                  <BookOpen size={28} />
                </div>

                <div className="about-book about-book-two">
                  <Library size={28} />
                </div>

                <div className="about-book about-book-three">
                  <GraduationCap size={28} />
                </div>
              </div>

              <div className="about-visual-circle"></div>

              <span className="about-visual-text">
                READ
                <br />
                LEARN
                <br />
                GROW
              </span>
            </div>
          </section>

          {/* =================================================
              INTRODUCTION
          ================================================= */}

          <section className="about-intro">
            <div className="about-intro-heading">
              <span>OUR PURPOSE</span>

              <h2>
                More than a library.
                <em>A learning space.</em>
              </h2>
            </div>

            <div className="about-intro-content">
              <p>
                A college library is more than a room filled with books. It is a
                place where students discover ideas, researchers find knowledge
                and teachers support learning.
              </p>

              <p>
                Pustakalaya brings that experience into one simple digital
                platform. Users can explore the available collection, search for
                books, check availability and manage their personal library
                activity.
              </p>
            </div>
          </section>

          {/* =================================================
              FEATURES
          ================================================= */}

          <section className="about-features">
            <div className="about-section-heading">
              <span>WHAT WE OFFER</span>

              <h2>
                Everything you need
                <em> in one place.</em>
              </h2>
            </div>

            <div className="about-feature-grid">
              {/* Search */}

              <div className="about-feature-card">
                <div className="about-feature-icon">
                  <Search size={20} />
                </div>

                <h3>Easy Discovery</h3>

                <p>
                  Search and filter the library collection to quickly find the
                  books you're looking for.
                </p>
              </div>

              {/* Availability */}

              <div className="about-feature-card">
                <div className="about-feature-icon">
                  <BookOpen size={20} />
                </div>

                <h3>Book Availability</h3>

                <p>
                  Check whether a book is currently available or unavailable
                  before planning your visit.
                </p>
              </div>

              {/* Students */}

              <div className="about-feature-card">
                <div className="about-feature-icon">
                  <Users size={20} />
                </div>

                <h3>Student & Teacher Access</h3>

                <p>
                  Personalized accounts help students and teachers manage their
                  library activities.
                </p>
              </div>

              {/* Management */}

              <div className="about-feature-card">
                <div className="about-feature-icon">
                  <ShieldCheck size={20} />
                </div>

                <h3>Smart Management</h3>

                <p>
                  Library staff can manage books, availability, users and
                  library records efficiently.
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              HOW IT WORKS
          ================================================= */}

          <section className="about-process">
            <div className="about-section-heading">
              <span>HOW IT WORKS</span>

              <h2>
                Simple from
                <em> start to finish.</em>
              </h2>
            </div>

            <div className="about-process-grid">
              <div className="about-process-item">
                <div className="about-process-number">01</div>

                <Search size={19} />

                <h3>Discover</h3>

                <p>
                  Search the Pustakalaya collection and find books that match
                  your interests or academic needs.
                </p>
              </div>

              <div className="about-process-item">
                <div className="about-process-number">02</div>

                <BookOpen size={19} />

                <h3>Check</h3>

                <p>
                  View book details and check its current availability before
                  making your next move.
                </p>
              </div>

              <div className="about-process-item">
                <div className="about-process-number">03</div>

                <Heart size={19} />

                <h3>Save</h3>

                <p>
                  Add interesting books to your wishlist and keep track of your
                  reading interests.
                </p>
              </div>

              <div className="about-process-item">
                <div className="about-process-number">04</div>

                <GraduationCap size={19} />

                <h3>Learn</h3>

                <p>
                  Access the resources you need and make your library experience
                  part of your academic journey.
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              LIBRARY VALUES
          ================================================= */}

          <section className="about-values">
            <div className="about-values-content">
              <span>OUR VALUES</span>

              <h2>
                Built around
                <em> learners.</em>
              </h2>

              <p>
                Pustakalaya is designed with one simple idea in mind: accessing
                knowledge should be easy, organized and welcoming.
              </p>

              <div className="about-values-list">
                <div>
                  <CheckIcon />
                  Accessible knowledge
                </div>

                <div>
                  <CheckIcon />
                  Simple user experience
                </div>

                <div>
                  <CheckIcon />
                  Organized library management
                </div>

                <div>
                  <CheckIcon />
                  Better academic support
                </div>
              </div>
            </div>

            <div className="about-values-card">
              <Clock3 size={25} />

              <span>PUSTAKALAYA</span>

              <h3>Every book has a story. Every reader has a journey.</h3>
            </div>
          </section>

          {/* =================================================
              CTA
          ================================================= */}

          <section className="about-cta">
            <div>
              <span>START EXPLORING</span>

              <h2>
                Your next great read
                <em> is waiting.</em>
              </h2>

              <p>
                Explore the Pustakalaya collection and discover something new
                today.
              </p>
            </div>

            <Link to="/books" className="about-cta-btn">
              Browse Library
              <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* =====================================================
   CHECK ICON
===================================================== */

function CheckIcon() {
  return <span className="about-check">✓</span>;
}

export default About;
