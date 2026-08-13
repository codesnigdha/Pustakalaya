import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  Hash,
  Library,
  MapPin,
  Star,
  Users,
  XCircle,
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import "./BookDetails.css";

const books = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    isbn: "9780132350884",
    year: 2008,
    rating: 4.8,
    totalCopies: 5,
    availableCopies: 3,
    publisher: "Prentice Hall",
    language: "English",
    pages: 464,
    cover:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=700&q=80",
    description:
      "Clean Code is a practical guide to writing readable, maintainable and professional software. It presents principles, patterns and techniques that help developers produce better code.",
  },
  {
    id: 2,
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    category: "Database",
    isbn: "9780078022159",
    year: 2019,
    rating: 4.7,
    totalCopies: 4,
    availableCopies: 0,
    publisher: "McGraw-Hill",
    language: "English",
    pages: 1376,
    cover:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=700&q=80",
    description:
      "A comprehensive introduction to database systems covering database design, relational databases, SQL, transactions, storage and modern database technologies.",
  },
  {
    id: 3,
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum",
    category: "Networking",
    isbn: "9780132126953",
    year: 2011,
    rating: 4.6,
    totalCopies: 6,
    availableCopies: 2,
    publisher: "Pearson",
    language: "English",
    pages: 960,
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80",
    description:
      "An extensive introduction to computer networking concepts, protocols, architectures and network technologies.",
  },
  {
    id: 4,
    title: "The Pragmatic Programmer",
    author: "David Thomas",
    category: "Programming",
    isbn: "9780135957059",
    year: 2019,
    rating: 4.9,
    totalCopies: 5,
    availableCopies: 4,
    publisher: "Addison-Wesley",
    language: "English",
    pages: 352,
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80",
    description:
      "A collection of practical programming advice covering software development, debugging, testing, architecture and professional development.",
  },
];

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const book = books.find((item) => item.id === Number(id));

  if (!book) {
    return (
      <div className="book-details-page">
        <Navbar />

        <main className="book-not-found">
          <div className="book-not-found-icon">
            <BookOpen size={40} />
          </div>

          <h1>Book Not Found</h1>

          <p>The book you're looking for doesn't exist in our catalogue.</p>

          <Link to="/books">
            <ArrowLeft size={17} />
            Back to Books
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;

  const handleProtectedAction = () => {
    setShowLoginMessage(true);
  };

  return (
    <div className="book-details-page">
      <Navbar />

      {/* ================= BREADCRUMB ================= */}

      <div className="book-details-breadcrumb">
        <div className="book-details-container">
          <Link to="/books">
            <ArrowLeft size={15} />
            Back to Books
          </Link>

          <span>/</span>

          <span>{book.category}</span>

          <span>/</span>

          <strong>{book.title}</strong>
        </div>
      </div>

      {/* ================= MAIN ================= */}

      <main className="book-details-main">
        <div className="book-details-container">
          <div className="book-details-layout">
            {/* ================= COVER ================= */}

            <div className="book-details-cover-section">
              <div className="book-details-cover">
                <img src={book.cover} alt={book.title} />

                <div
                  className={`book-details-availability ${
                    isAvailable ? "available" : "unavailable"
                  }`}
                >
                  {isAvailable ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <XCircle size={15} />
                  )}

                  {isAvailable ? "Available" : "Currently Not Available"}
                </div>
              </div>

              <div className="book-cover-note">
                <Library size={15} />

                <span>Physical copy available in college library</span>
              </div>
            </div>

            {/* ================= INFORMATION ================= */}

            <div className="book-details-content">
              <div className="book-details-category">{book.category}</div>

              <h1>{book.title}</h1>

              <p className="book-details-author">
                by <strong>{book.author}</strong>
              </p>

              <div className="book-details-rating">
                <div className="rating-stars">
                  <Star size={17} fill="currentColor" />
                  <strong>{book.rating}</strong>
                </div>

                <span>Highly rated by library members</span>
              </div>

              <p className="book-details-description">{book.description}</p>

              {/* ================= ACTIONS ================= */}

              <div className="book-details-actions">
                {isAvailable ? (
                  <button
                    className="book-borrow-btn"
                    onClick={handleProtectedAction}
                  >
                    <BookOpen size={18} />
                    Borrow Book
                  </button>
                ) : (
                  <button
                    className="book-reserve-btn"
                    onClick={handleProtectedAction}
                  >
                    <Clock3 size={18} />
                    Reserve Book
                  </button>
                )}

                <button
                  className={`book-wishlist-btn ${wishlist ? "active" : ""}`}
                  onClick={() => setWishlist(!wishlist)}
                  title={wishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={19} fill={wishlist ? "currentColor" : "none"} />
                </button>
              </div>

              {/* ================= AVAILABILITY ================= */}

              <div className="book-copy-status">
                <div className="copy-status-icon">
                  <Library size={19} />
                </div>

                <div>
                  <strong>
                    {book.availableCopies} of {book.totalCopies} copies
                    available
                  </strong>

                  <span>
                    {isAvailable
                      ? "You can borrow this book now."
                      : "All copies are currently issued."}
                  </span>
                </div>

                <div
                  className={`copy-status-badge ${
                    isAvailable ? "available" : "unavailable"
                  }`}
                >
                  {isAvailable ? "Available" : "Unavailable"}
                </div>
              </div>

              {/* ================= DETAILS ================= */}

              <div className="book-information">
                <h2>Book Information</h2>

                <div className="book-information-grid">
                  <div>
                    <Hash size={16} />

                    <span>ISBN</span>

                    <strong>{book.isbn}</strong>
                  </div>

                  <div>
                    <CalendarDays size={16} />

                    <span>Publication Year</span>

                    <strong>{book.year}</strong>
                  </div>

                  <div>
                    <Users size={16} />

                    <span>Author</span>

                    <strong>{book.author}</strong>
                  </div>

                  <div>
                    <BookOpen size={16} />

                    <span>Pages</span>

                    <strong>{book.pages}</strong>
                  </div>

                  <div>
                    <Library size={16} />

                    <span>Publisher</span>

                    <strong>{book.publisher}</strong>
                  </div>

                  <div>
                    <MapPin size={16} />

                    <span>Location</span>

                    <strong>Main Library</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= LIBRARY NOTE ================= */}

          <section className="book-library-note">
            <div className="book-library-note-icon">
              <BookOpen size={22} />
            </div>

            <div>
              <h3>Library Collection</h3>

              <p>
                This book is part of the Pustakalaya college library collection.
                Availability is updated whenever books are issued or returned.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* ================= LOGIN MESSAGE ================= */}

      {showLoginMessage && (
        <div
          className="book-login-overlay"
          onClick={() => setShowLoginMessage(false)}
        >
          <div
            className="book-login-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="book-modal-close"
              onClick={() => setShowLoginMessage(false)}
            >
              <XCircle size={20} />
            </button>

            <div className="book-modal-icon">
              <BookOpen size={25} />
            </div>

            <h2>Login Required</h2>

            <p>
              Please log in to your Pustakalaya account to borrow, reserve or
              manage this book.
            </p>

            <div className="book-modal-actions">
              <button
                onClick={() => navigate("/login")}
                className="book-modal-login"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="book-modal-signup"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default BookDetails;
