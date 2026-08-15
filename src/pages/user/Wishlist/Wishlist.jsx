import {
  BookOpen,
  Heart,
  Search,
  Filter,
  Trash2,
  Eye,
  BookMarked,
  CheckCircle2,
  XCircle,
  Bell,
  BellRing,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import "./Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [notifiedBooks, setNotifiedBooks] = useState([]);

  /* =====================================================
     LOAD WISHLIST
  ===================================================== */

  useEffect(() => {
    try {
      const storedWishlist =
        JSON.parse(localStorage.getItem("pustakalaya_wishlist")) || [];

      const storedNotifications =
        JSON.parse(
          localStorage.getItem("pustakalaya_availability_notifications"),
        ) || [];

      setWishlist(Array.isArray(storedWishlist) ? storedWishlist : []);

      setNotifiedBooks(
        Array.isArray(storedNotifications) ? storedNotifications : [],
      );
    } catch (error) {
      console.error("Unable to load wishlist:", error);

      setWishlist([]);
      setNotifiedBooks([]);
    }
  }, []);

  /* =====================================================
     UPDATE WISHLIST
  ===================================================== */

  const updateWishlist = (updatedWishlist) => {
    setWishlist(updatedWishlist);

    localStorage.setItem(
      "pustakalaya_wishlist",
      JSON.stringify(updatedWishlist),
    );
  };

  /* =====================================================
     GET AVAILABILITY
  ===================================================== */

  const isBookAvailable = (book) => {
    if (typeof book.available === "boolean") {
      return book.available;
    }

    if (typeof book.availableCopies !== "undefined") {
      return Number(book.availableCopies) > 0;
    }

    if (typeof book.quantity !== "undefined") {
      return Number(book.quantity) > 0;
    }

    return false;
  };

  /* =====================================================
     REMOVE FROM WISHLIST
  ===================================================== */

  const removeBook = (id) => {
    const updatedWishlist = wishlist.filter((book) => book.id !== id);

    updateWishlist(updatedWishlist);
  };

  /* =====================================================
     BORROW BOOK
  ===================================================== */

  const borrowBook = (book) => {
    const storedBooks =
      JSON.parse(localStorage.getItem("pustakalaya_my_books")) || [];

    const alreadyBorrowed = storedBooks.some(
      (item) =>
        String(item.bookId) === String(book.id) && item.status === "borrowed",
    );

    if (alreadyBorrowed) {
      alert("This book is already in your borrowed books.");

      return;
    }

    const today = new Date();

    const dueDate = new Date();

    dueDate.setDate(dueDate.getDate() + 14);

    const newBook = {
      id: Date.now(),

      bookId: book.id,

      title: book.title,

      author: book.author,

      category: book.category,

      isbn: book.isbn || "",

      cover: book.cover || book.coverUrl || "",

      borrowDate: today.toISOString().split("T")[0],

      dueDate: dueDate.toISOString().split("T")[0],

      returnDate: null,

      status: "borrowed",
    };

    localStorage.setItem(
      "pustakalaya_my_books",
      JSON.stringify([...storedBooks, newBook]),
    );

    /* Remove after borrowing */

    const updatedWishlist = wishlist.filter((item) => item.id !== book.id);

    updateWishlist(updatedWishlist);

    alert(`"${book.title}" has been added to My Books.`);
  };

  /* =====================================================
     NOTIFY IF AVAILABLE
  ===================================================== */

  const notifyIfAvailable = (book) => {
    const alreadyNotified = notifiedBooks.includes(book.id);

    if (alreadyNotified) {
      return;
    }

    const updatedNotifications = [...notifiedBooks, book.id];

    setNotifiedBooks(updatedNotifications);

    localStorage.setItem(
      "pustakalaya_availability_notifications",
      JSON.stringify(updatedNotifications),
    );

    alert(`You will be notified when "${book.title}" becomes available.`);
  };

  /* =====================================================
     SEARCH + FILTER
  ===================================================== */

  const filteredWishlist = useMemo(() => {
    return wishlist.filter((book) => {
      const searchText = `
            ${book.title || ""}
            ${book.author || ""}
            ${book.category || ""}
            ${book.isbn || ""}
          `.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase().trim());

      const available = isBookAvailable(book);

      const matchesFilter =
        filter === "all" ||
        (filter === "available" && available) ||
        (filter === "unavailable" && !available);

      return matchesSearch && matchesFilter;
    });
  }, [wishlist, search, filter]);

  /* =====================================================
     COUNTS
  ===================================================== */

  const availableCount = wishlist.filter((book) =>
    isBookAvailable(book),
  ).length;

  const unavailableCount = wishlist.filter(
    (book) => !isBookAvailable(book),
  ).length;

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =====================================================
     COVER
  ===================================================== */

  const getCover = (book) => {
    return book.cover || book.coverUrl || book.image || "";
  };

  return (
    <div className="wishlist-page">
      <Navbar />

      <main className="wishlist-main">
        <div className="wishlist-container">
          {/* =================================================
              HEADER
          ================================================= */}

          <section className="wishlist-header">
            <div>
              <span className="wishlist-label">SAVED BOOKS</span>

              <h1>
                My
                <em> Wishlist.</em>
              </h1>

              <p>Keep track of books you want to read or borrow later.</p>
            </div>

            <div className="wishlist-header-icon">
              <Heart size={30} />
            </div>
          </section>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="wishlist-summary">
            <div className="wishlist-summary-card">
              <div className="wishlist-summary-icon">
                <Heart size={18} />
              </div>

              <div>
                <span>TOTAL SAVED</span>

                <strong>{wishlist.length}</strong>
              </div>
            </div>

            <div className="wishlist-summary-card wishlist-available">
              <div className="wishlist-summary-icon">
                <CheckCircle2 size={18} />
              </div>

              <div>
                <span>AVAILABLE</span>

                <strong>{availableCount}</strong>
              </div>
            </div>

            <div className="wishlist-summary-card wishlist-unavailable">
              <div className="wishlist-summary-icon">
                <XCircle size={18} />
              </div>

              <div>
                <span>CURRENTLY UNAVAILABLE</span>

                <strong>{unavailableCount}</strong>
              </div>
            </div>
          </section>

          {/* =================================================
              CONTROLS
          ================================================= */}

          <section className="wishlist-controls">
            <div className="wishlist-search">
              <Search size={16} />

              <input
                type="text"
                placeholder="Search your wishlist..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="wishlist-filter">
              <Filter size={15} />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Books</option>

                <option value="available">Available</option>

                <option value="unavailable">Currently Unavailable</option>
              </select>
            </div>
          </section>

          {/* =================================================
              LIST
          ================================================= */}

          <section className="wishlist-list">
            <div className="wishlist-list-header">
              <div>
                <span>YOUR COLLECTION</span>

                <h2>Saved Books</h2>
              </div>

              <span className="wishlist-count">
                {filteredWishlist.length}{" "}
                {filteredWishlist.length === 1 ? "book" : "books"}
              </span>
            </div>

            {/* =================================================
                EMPTY
            ================================================= */}

            {filteredWishlist.length === 0 ? (
              <div className="wishlist-empty">
                <Heart size={32} />

                <h3>
                  {wishlist.length === 0
                    ? "Your wishlist is empty"
                    : "No books found"}
                </h3>

                <p>
                  {wishlist.length === 0
                    ? "Browse the library and save books you want to read later."
                    : "Try changing your search or availability filter."}
                </p>

                {wishlist.length === 0 ? (
                  <Link to="/books" className="wishlist-browse-btn">
                    <BookOpen size={15} />
                    Browse Books
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="wishlist-browse-btn"
                    onClick={() => {
                      setSearch("");
                      setFilter("all");
                    }}
                  >
                    Show All Books
                  </button>
                )}
              </div>
            ) : (
              /* =================================================
                 GRID
              ================================================= */

              <div className="wishlist-grid">
                {filteredWishlist.map((book) => {
                  const available = isBookAvailable(book);

                  const cover = getCover(book);

                  const hasNotification = notifiedBooks.includes(book.id);

                  return (
                    <article className="wishlist-card" key={book.id}>
                      {/* COVER */}

                      <div className="wishlist-cover">
                        {cover ? (
                          <img src={cover} alt={book.title} />
                        ) : (
                          <>
                            <BookOpen size={28} />

                            <span>PUSTAKALAYA</span>
                          </>
                        )}

                        {/* REMOVE */}

                        <button
                          type="button"
                          className="wishlist-remove"
                          onClick={() => removeBook(book.id)}
                          title="Remove from wishlist"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* CONTENT */}

                      <div className="wishlist-card-content">
                        <div className="wishlist-card-top">
                          <span>{book.category || "Other"}</span>

                          {available ? (
                            <span className="wishlist-available-badge">
                              <CheckCircle2 size={11} />
                              Available
                            </span>
                          ) : (
                            <span className="wishlist-unavailable-badge">
                              <XCircle size={11} />
                              Not Available
                            </span>
                          )}
                        </div>

                        <h3>{book.title}</h3>

                        <p className="wishlist-author">
                          {book.author || "Unknown Author"}
                        </p>

                        {book.isbn && (
                          <div className="wishlist-isbn">ISBN: {book.isbn}</div>
                        )}

                        {book.addedDate && (
                          <div className="wishlist-added">
                            Added on {formatDate(book.addedDate)}
                          </div>
                        )}

                        {/* ACTIONS */}

                        <div className="wishlist-actions">
                          <Link
                            to={`/books/${book.id}`}
                            className="wishlist-view-btn"
                          >
                            <Eye size={14} />
                            View
                          </Link>

                          {available ? (
                            <button
                              type="button"
                              className="wishlist-borrow-btn"
                              onClick={() => borrowBook(book)}
                            >
                              <BookMarked size={14} />
                              Borrow
                            </button>
                          ) : (
                            <button
                              type="button"
                              className={`wishlist-notify-btn ${
                                hasNotification ? "active" : ""
                              }`}
                              onClick={() => notifyIfAvailable(book)}
                              disabled={hasNotification}
                            >
                              {hasNotification ? (
                                <BellRing size={14} />
                              ) : (
                                <Bell size={14} />
                              )}

                              {hasNotification
                                ? "Notification Set"
                                : "Notify Me"}
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Wishlist;
