import {
  ArrowRight,
  BookOpen,
  BookMarked,
  Library,
  Users,
  Search,
  Clock3,
  ShieldCheck,
  Heart,
  GraduationCap,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import "./Home.css";

/* =====================================================
   FEATURED BOOKS
===================================================== */

const featuredBooks = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    cover:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80",
    available: true,
  },

  {
    id: 2,
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    category: "Database",
    cover:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80",
    available: true,
  },

  {
    id: 3,
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum",
    category: "Networking",
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80",
    available: false,
  },

  {
    id: 4,
    title: "The Pragmatic Programmer",
    author: "David Thomas",
    category: "Programming",
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80",
    available: true,
  },
];

/* =====================================================
   CATEGORIES
===================================================== */

const categories = [
  {
    name: "Computer Science",
    icon: "💻",
    count: "320+ Books",
  },

  {
    name: "Engineering",
    icon: "⚙️",
    count: "280+ Books",
  },

  {
    name: "Mathematics",
    icon: "📐",
    count: "190+ Books",
  },

  {
    name: "Literature",
    icon: "📖",
    count: "240+ Books",
  },

  {
    name: "Management",
    icon: "📊",
    count: "170+ Books",
  },

  {
    name: "Science",
    icon: "🔬",
    count: "210+ Books",
  },
];

/* =====================================================
   HOME
===================================================== */

function Home() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  /* ===================================================
     LIBRARY STATUS
  =================================================== */

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const currentHour = currentTime.getHours();

  const isLibraryOpen = currentHour >= 8 && currentHour < 20;

  /* ===================================================
     SEARCH
  =================================================== */

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (query) {
      navigate(`/books?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/books");
    }
  };

  /* ===================================================
     RETURN JSX
  =================================================== */

  return (
    <div className="home-page">
      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />

      {/* =================================================
          HERO
      ================================================= */}

      <main>
        <section className="home-hero">
          <div className="home-hero-pattern"></div>

          <div className="home-container home-hero-container">
            {/* ================= HERO CONTENT ================= */}

            <div className="home-hero-content">
              <div className="home-hero-badge">
                <Sparkles size={15} />

                <span>Your Campus Library, Smarter.</span>
              </div>

              <h1>
                Discover Your Next
                <span> Great Read.</span>
              </h1>

              <p>
                Explore thousands of books, discover new ideas, and make your
                college library experience simpler with Pustakalaya.
              </p>

              {/* ================= SEARCH ================= */}

              <form className="home-search" onSubmit={handleSearch}>
                <Search size={21} />

                <input
                  type="text"
                  placeholder="Search by title, author or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <button type="submit">Search</button>
              </form>

              {/* ================= HERO BUTTONS ================= */}

              <div className="home-hero-actions">
                <Link to="/books" className="home-primary-btn">
                  Explore Books
                  <ArrowRight size={18} />
                </Link>

                <Link to="/signup" className="home-secondary-btn">
                  Join Pustakalaya
                </Link>
              </div>

              {/* ================= TRUST ================= */}

              <div className="home-trust">
                <div className="home-trust-avatars">
                  <span>S</span>
                  <span>T</span>
                  <span>R</span>
                  <span>+</span>
                </div>

                <div>
                  <strong>Trusted by campus readers</strong>

                  <small>Students & faculty discovering books every day</small>
                </div>
              </div>
            </div>

            {/* ================= HERO VISUAL ================= */}

            <div className="home-hero-visual">
              <div className="home-book-stack">
                {/* ================= BOOK COUNT ================= */}

                <div className="home-floating-card home-floating-top">
                  <BookMarked size={18} />

                  <div>
                    <strong>12,500+</strong>

                    <span>Books Available</span>
                  </div>
                </div>

                {/* ================= MAIN BOOK ================= */}

                <div className="home-main-book">
                  <div className="home-book-glow"></div>

                  <div className="home-book-cover">
                    <div className="home-book-decoration">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <BookOpen size={50} />

                    <div className="home-cover-title">
                      <small>THE WORLD OF</small>

                      <strong>KNOWLEDGE</strong>

                      <span>PUSTAKALAYA</span>
                    </div>

                    <div className="home-cover-bottom">COLLEGE LIBRARY</div>
                  </div>
                </div>

                {/* =================================================
                    LIBRARY STATUS
                ================================================= */}

                <div
                  className={`home-floating-card home-floating-bottom ${
                    isLibraryOpen ? "library-open" : "library-closed"
                  }`}
                >
                  <div className="home-status-dot"></div>

                  <div>
                    <strong>
                      {isLibraryOpen ? "Library Open" : "Library Closed"}
                    </strong>

                    <span>
                      {isLibraryOpen ? "8:00 AM — 8:00 PM" : "Opens at 8:00 AM"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            FEATURED BOOKS
        ================================================= */}

        <section className="home-section home-featured">
          <div className="home-container">
            <div className="home-section-header">
              <div>
                <span className="home-section-label">EXPLORE</span>

                <h2>
                  Featured <span>Books</span>
                </h2>

                <p>
                  Discover some of the most popular books in our campus library.
                </p>
              </div>

              <Link to="/books" className="home-view-all">
                View All Books
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="home-books-grid">
              {featuredBooks.map((book) => (
                <article className="home-book-card" key={book.id}>
                  <div className="home-book-image">
                    <img src={book.cover} alt={book.title} />

                    <span
                      className={`home-availability ${
                        book.available ? "available" : "unavailable"
                      }`}
                    >
                      {book.available ? "Available" : "Currently Not Available"}
                    </span>

                    <button
                      className="home-wishlist"
                      onClick={() => navigate("/login")}
                      aria-label="Add to wishlist"
                    >
                      <Heart size={18} />
                    </button>
                  </div>

                  <div className="home-book-info">
                    <span className="home-book-category">{book.category}</span>

                    <h3>{book.title}</h3>

                    <p>{book.author}</p>

                    <Link
                      to={`/books/${book.id}`}
                      className="home-book-details"
                    >
                      View Details
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================
            FEATURES
        ================================================= */}

        <section className="home-section home-features-section">
          <div className="home-container">
            <div className="home-centered-header">
              <span className="home-section-label">WHY PUSTAKALAYA</span>

              <h2>
                Everything You Need,
                <span> In One Place.</span>
              </h2>

              <p>
                A smarter way to discover, borrow and manage your college
                library experience.
              </p>
            </div>

            <div className="home-features-grid">
              <div className="home-feature-card">
                <div className="home-feature-icon">
                  <Search size={25} />
                </div>

                <h3>Smart Search</h3>

                <p>
                  Find books instantly by title, author, ISBN or category with
                  powerful filters.
                </p>

                <Link to="/books">
                  Explore
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="home-feature-card">
                <div className="home-feature-icon">
                  <BookMarked size={25} />
                </div>

                <h3>Easy Borrowing</h3>

                <p>
                  Borrow available books and keep track of your due dates from
                  your dashboard.
                </p>

                <Link to="/books">
                  Browse Books
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="home-feature-card">
                <div className="home-feature-icon">
                  <Clock3 size={25} />
                </div>

                <h3>Never Miss a Due Date</h3>

                <p>
                  Get notifications about upcoming due dates and overdue books.
                </p>

                <Link to="/signup">
                  Get Started
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="home-feature-card">
                <div className="home-feature-icon">
                  <ShieldCheck size={25} />
                </div>

                <h3>Simple & Secure</h3>

                <p>
                  Manage your library activity through a clean and secure user
                  experience.
                </p>

                <Link to="/signup">
                  Join Now
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            HOW IT WORKS
        ================================================= */}

        <section className="home-section home-how-section">
          <div className="home-container">
            <div className="home-how-layout">
              <div className="home-how-content">
                <span className="home-section-label">HOW IT WORKS</span>

                <h2>
                  Your Library,
                  <span> Simplified.</span>
                </h2>

                <p>
                  Pustakalaya makes finding and managing books easier than ever.
                </p>

                <Link to="/signup" className="home-primary-btn">
                  Start Exploring
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="home-steps">
                <div className="home-step">
                  <div className="home-step-number">01</div>

                  <div>
                    <h3>Search</h3>

                    <p>
                      Search our catalogue and find the perfect book for your
                      needs.
                    </p>
                  </div>
                </div>

                <div className="home-step">
                  <div className="home-step-number">02</div>

                  <div>
                    <h3>Borrow or Reserve</h3>

                    <p>
                      Borrow an available book or reserve one that is currently
                      unavailable.
                    </p>
                  </div>
                </div>

                <div className="home-step">
                  <div className="home-step-number">03</div>

                  <div>
                    <h3>Read & Return</h3>

                    <p>Enjoy your book and return it before the due date.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            CATEGORIES
        ================================================= */}

        <section className="home-section home-categories">
          <div className="home-container">
            <div className="home-section-header">
              <div>
                <span className="home-section-label">DISCOVER</span>

                <h2>
                  Browse by <span>Category</span>
                </h2>

                <p>Explore books across different fields and subjects.</p>
              </div>
            </div>

            <div className="home-category-grid">
              {categories.map((category) => (
                <Link
                  to={`/books?category=${encodeURIComponent(category.name)}`}
                  className="home-category-card"
                  key={category.name}
                >
                  <div className="home-category-icon">{category.icon}</div>

                  <div>
                    <h3>{category.name}</h3>

                    <span>{category.count}</span>
                  </div>

                  <ChevronRight size={18} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================
            CTA
        ================================================= */}

        <section className="home-cta-section">
          <div className="home-container">
            <div className="home-cta">
              <div className="home-cta-decoration"></div>

              <div className="home-cta-content">
                <BookOpen size={38} />

                <h2>
                  Ready to Discover
                  <span> Something New?</span>
                </h2>

                <p>
                  Join Pustakalaya and make your campus library experience
                  smarter and simpler.
                </p>

                <div className="home-cta-buttons">
                  <Link to="/signup" className="home-cta-primary">
                    Create Account
                    <ArrowRight size={18} />
                  </Link>

                  <Link to="/books" className="home-cta-secondary">
                    Browse Books
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =================================================
            STATS
        ================================================= */}

      <section className="home-stats-section">
        <div className="home-container">
          <div className="home-stats-grid">
            <div className="home-stat-item">
              <div className="home-stat-icon">
                <Library size={23} />
              </div>

              <div>
                <strong>12.5K+</strong>
                <span>Books</span>
              </div>
            </div>

            <div className="home-stat-item">
              <div className="home-stat-icon">
                <Users size={23} />
              </div>

              <div>
                <strong>3.2K+</strong>
                <span>Members</span>
              </div>
            </div>

            <div className="home-stat-item">
              <div className="home-stat-icon">
                <BookMarked size={23} />
              </div>

              <div>
                <strong>8.7K+</strong>
                <span>Books Borrowed</span>
              </div>
            </div>

            <div className="home-stat-item">
              <div className="home-stat-icon">
                <GraduationCap size={23} />
              </div>

              <div>
                <strong>25+</strong>
                <span>Departments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />
    </div>
  );
}

export default Home;
