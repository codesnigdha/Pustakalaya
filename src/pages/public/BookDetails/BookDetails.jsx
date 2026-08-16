import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  Hash,
  Library,
  LoaderCircle,
  Star,
  Users,
  X,
  XCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import { getBookById } from "../../../services/bookService";
import { borrowBook } from "../../../services/borrowService";

import "./BookDetails.css";

const WISHLIST_KEY = "pustakalaya_wishlist";
const USER_KEY = "pustakalaya_user";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=700&q=80";

/* =========================
   WISHLIST
========================= */

function getWishlistIds() {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed.map(Number) : [];
  } catch {
    return [];
  }
}

/* =========================
   USER
========================= */

function getCurrentUser() {
  try {
    const stored = localStorage.getItem(USER_KEY);

    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/* =========================
   CATEGORY
========================= */

function getCategoryName(book) {
  if (!book) {
    return "General";
  }

  if (book.category && typeof book.category === "object") {
    return book.category.name || "General";
  }

  return String(book.category || "General");
}

/* =========================
   COVER
========================= */

function getCoverImage(book) {
  return book?.coverImage || DEFAULT_COVER;
}

/* =========================
   ERROR
========================= */

function getApiError(error, fallback) {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data?.message) {
    return data.message;
  }

  if (data?.error) {
    return data.error;
  }

  return error?.message || fallback;
}

/* =========================
   COMPONENT
========================= */

function BookDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [book, setBook] = useState(null);

  const [loading, setLoading] = useState(true);

  const [pageError, setPageError] = useState("");

  const [wishlist, setWishlist] = useState(() =>
    getWishlistIds().includes(Number(id)),
  );

  const [actionLoading, setActionLoading] = useState(false);

  const [actionMessage, setActionMessage] = useState("");

  const [actionError, setActionError] = useState("");

  const [showLoginModal, setShowLoginModal] = useState(false);

  /* =========================
     LOAD BOOK
  ========================= */

  useEffect(() => {
    let mounted = true;

    async function loadBook() {
      try {
        setLoading(true);

        setPageError("");
        setActionMessage("");
        setActionError("");

        const data = await getBookById(id);

        if (mounted) {
          setBook(data);

          setWishlist(getWishlistIds().includes(Number(id)));
        }
      } catch (error) {
        console.error("Book details error:", error);

        if (mounted) {
          setPageError(getApiError(error, "Unable to load book details."));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadBook();
    } else {
      setPageError("Invalid book ID.");

      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  /* =========================
     BOOK DATA
  ========================= */

  const availableCopies = Number(book?.availableCopies ?? 0);

  const totalCopies = Number(book?.totalCopies ?? 0);

  const isAvailable = availableCopies > 0;

  const categoryName = getCategoryName(book);

  const coverImage = getCoverImage(book);

  const publicationYear = book?.publicationYear ?? "—";

  /* =========================
     WISHLIST
  ========================= */

  const toggleWishlist = () => {
    const bookId = Number(id);

    const currentIds = getWishlistIds();

    const nextIds = currentIds.includes(bookId)
      ? currentIds.filter((item) => item !== bookId)
      : [...currentIds, bookId];

    localStorage.setItem(WISHLIST_KEY, JSON.stringify(nextIds));

    setWishlist(nextIds.includes(bookId));
  };

  /* =========================
     USER ID
  ========================= */

  const getUserId = () => {
    const user = getCurrentUser();

    return user?.id ?? user?.userId ?? null;
  };

  /* =========================
     BORROW
  ========================= */

  const handleBorrow = async () => {
    const user = getCurrentUser();

    /* -------------------------
       LOGIN CHECK
    ------------------------- */

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    /* -------------------------
       GET USER ID
    ------------------------- */

    const userId = getUserId();

    if (!userId) {
      setActionError("Unable to identify your account. Please log in again.");

      return;
    }

    /* -------------------------
       BORROW BOOK
    ------------------------- */

    try {
      setActionLoading(true);

      setActionMessage("");
      setActionError("");

      const response = await borrowBook(userId, Number(id));

      /* -------------------------
         SUCCESS MESSAGE
      ------------------------- */

      setActionMessage(response?.message || "Book borrowed successfully.");

      /* -------------------------
         UPDATE AVAILABLE COPIES
      ------------------------- */

      setBook((previous) => {
        if (!previous) {
          return previous;
        }

        const current = Number(previous.availableCopies ?? 0);

        return {
          ...previous,
          availableCopies: Math.max(current - 1, 0),
        };
      });
    } catch (error) {
      console.error("Borrow book error:", error);

      setActionError(error?.message || "Unable to borrow this book.");
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="book-details-page">
        <Navbar />

        <main className="book-details-state">
          <LoaderCircle size={40} className="book-details-spinner" />

          <h1>Loading Book...</h1>

          <p>Getting the latest book information.</p>
        </main>

        <Footer />
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (pageError || !book) {
    return (
      <div className="book-details-page">
        <Navbar />

        <main className="book-details-state">
          <div className="book-state-icon">
            <BookOpen size={38} />
          </div>

          <h1>Book Not Found</h1>

          <p>{pageError || "The requested book could not be found."}</p>

          <Link to="/books" className="book-back-button">
            <ArrowLeft size={16} />
            Back to Books
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  /* =========================
     MAIN
  ========================= */

  return (
    <div className="book-details-page">
      <Navbar />

      {/* BREADCRUMB */}

      <div className="book-details-breadcrumb">
        <div className="book-details-container">
          <Link to="/books">
            <ArrowLeft size={15} />
            Back to Books
          </Link>

          <span>/</span>

          <span>{categoryName}</span>

          <span>/</span>

          <strong>{book.title}</strong>
        </div>
      </div>

      {/* MAIN */}

      <main className="book-details-main">
        <div className="book-details-container">
          <div className="book-details-layout">
            {/* COVER */}

            <div className="book-details-cover-section">
              <div className="book-details-cover">
                <img
                  src={coverImage}
                  alt={book.title || "Book"}
                  onError={(event) => {
                    event.currentTarget.onerror = null;

                    event.currentTarget.src = DEFAULT_COVER;
                  }}
                />

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

                <span>Physical copy available in the library</span>
              </div>
            </div>

            {/* CONTENT */}

            <div className="book-details-content">
              <span className="book-details-category">{categoryName}</span>

              <h1>{book.title}</h1>

              <p className="book-details-author">
                by <strong>{book.author || "Unknown Author"}</strong>
              </p>

              {/* RATING */}

              <div className="book-details-rating">
                <div className="rating-stars">
                  <Star size={17} fill="currentColor" />

                  <strong>{book.rating ?? "N/A"}</strong>
                </div>

                <span>Library catalogue rating</span>
              </div>

              {/* DESCRIPTION */}

              <p className="book-details-description">
                {book.description ||
                  "No description is available for this book yet."}
              </p>

              {/* ACTIONS */}

              <div className="book-details-actions">
                {isAvailable ? (
                  <button
                    type="button"
                    className="book-borrow-btn"
                    onClick={handleBorrow}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <LoaderCircle size={18} className="book-action-spinner" />
                    ) : (
                      <BookOpen size={18} />
                    )}

                    {actionLoading ? "Borrowing..." : "Borrow Book"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="book-notify-btn"
                    onClick={() => setActionMessage("Add to wishlist.")}
                  >
                    <Clock3 size={18} />
                    Currently Unavailable
                  </button>
                )}

                {/* WISHLIST */}

                <button
                  type="button"
                  className={`book-wishlist-btn ${wishlist ? "active" : ""}`}
                  onClick={toggleWishlist}
                >
                  <Heart size={22} fill={wishlist ? "currentColor" : "none"} />
                </button>
              </div>

              {/* ACTION MESSAGE */}

              {actionMessage && (
                <div
                  className={`book-action-message ${
                    actionMessage === "Add to wishlist."
                      ? "wishlist-message"
                      : "borrow-success"
                  }`}
                >
                  <CheckCircle2 size={16} />
                  <span>{actionMessage}</span>
                </div>
              )}

              {/* ERROR */}

              {actionError && (
                <div className="book-action-message error">
                  <XCircle size={16} />

                  <span>{actionError}</span>
                </div>
              )}

              {/* COPY STATUS */}

              <div className="book-copy-status">
                <div className="copy-status-icon">
                  <Library size={19} />
                </div>

                <div className="copy-status-content">
                  <strong>
                    {availableCopies} of {totalCopies} copies available
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

              {/* BOOK INFORMATION */}

              <div className="book-information">
                <h2>Book Information</h2>

                <div className="book-information-grid">
                  <div>
                    <Hash size={16} />

                    <span>ISBN</span>

                    <strong>{book.isbn || "—"}</strong>
                  </div>

                  <div>
                    <CalendarDays size={16} />

                    <span>Publication Year</span>

                    <strong>{publicationYear}</strong>
                  </div>

                  <div>
                    <Users size={16} />

                    <span>Author</span>

                    <strong>{book.author || "—"}</strong>
                  </div>

                  <div>
                    <Library size={16} />

                    <span>Publisher</span>

                    <strong>{book.publisher || "—"}</strong>
                  </div>

                  <div>
                    <BookOpen size={16} />

                    <span>Total Copies</span>

                    <strong>{totalCopies}</strong>
                  </div>

                  <div>
                    <CheckCircle2 size={16} />

                    <span>Available Copies</span>

                    <strong>{availableCopies}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LIBRARY NOTE */}

          <section className="book-library-note">
            <div className="book-library-note-icon">
              <BookOpen size={22} />
            </div>

            <div>
              <h3>Library Collection</h3>

              <p>
                This book is part of the Pustakalaya library collection.
                Availability is updated whenever books are issued or returned.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* LOGIN MODAL */}

      {showLoginModal && (
        <div
          className="book-login-overlay"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="book-login-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="book-modal-close"
              onClick={() => setShowLoginModal(false)}
            >
              <X size={19} />
            </button>

            <div className="book-modal-icon">
              <BookOpen size={25} />
            </div>

            <h2>Login Required</h2>

            <p>Please log in to your Pustakalaya account to borrow books.</p>

            <div className="book-modal-actions">
              <button
                type="button"
                className="book-modal-login"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                type="button"
                className="book-modal-signup"
                onClick={() => navigate("/signup")}
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
