import {
  BookOpen,
  Heart,
  Search,
  Filter,
  Trash2,
  Eye,
  Plus,
  CheckCircle2,
  XCircle,
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

  /* =====================================================
     LOAD WISHLIST
  ===================================================== */

  useEffect(() => {
    const storedWishlist = JSON.parse(
      localStorage.getItem("pustakalaya_wishlist"),
    );

    if (storedWishlist) {
      setWishlist(storedWishlist);
      return;
    }

    /* Demo data */

    const demoWishlist = [
      {
        id: 1,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Programming",
        isbn: "9780132350884",
        available: true,
        addedDate: "2026-08-05",
      },
      {
        id: 2,
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        category: "Programming",
        isbn: "9780135957059",
        available: false,
        addedDate: "2026-08-07",
      },
      {
        id: 3,
        title: "Artificial Intelligence",
        author: "Stuart Russell",
        category: "Artificial Intelligence",
        isbn: "9780134610993",
        available: true,
        addedDate: "2026-08-10",
      },
      {
        id: 4,
        title: "Computer Organization",
        author: "Carl Hamacher",
        category: "Computer Science",
        isbn: "9780071247806",
        available: true,
        addedDate: "2026-08-11",
      },
    ];

    localStorage.setItem("pustakalaya_wishlist", JSON.stringify(demoWishlist));

    setWishlist(demoWishlist);
  }, []);

  /* =====================================================
     UPDATE LOCAL STORAGE
  ===================================================== */

  const updateWishlist = (updatedWishlist) => {
    setWishlist(updatedWishlist);

    localStorage.setItem(
      "pustakalaya_wishlist",
      JSON.stringify(updatedWishlist),
    );
  };

  /* =====================================================
     REMOVE BOOK
  ===================================================== */

  const removeBook = (id) => {
    const updatedWishlist = wishlist.filter((book) => book.id !== id);

    updateWishlist(updatedWishlist);
  };

  /* =====================================================
     ADD TO MY BOOKS
  ===================================================== */

  const addToMyBooks = (book) => {
    const storedBooks =
      JSON.parse(localStorage.getItem("pustakalaya_my_books")) || [];

    const alreadyBorrowed = storedBooks.some(
      (item) => item.title === book.title && item.status === "borrowed",
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

      title: book.title,

      author: book.author,

      category: book.category,

      borrowDate: today.toISOString().split("T")[0],

      dueDate: dueDate.toISOString().split("T")[0],

      returnDate: null,

      status: "borrowed",
    };

    localStorage.setItem(
      "pustakalaya_my_books",
      JSON.stringify([...storedBooks, newBook]),
    );

    /*
     * Remove from wishlist after borrowing.
     */

    const updatedWishlist = wishlist.filter((item) => item.id !== book.id);

    updateWishlist(updatedWishlist);

    alert(`${book.title} has been added to My Books.`);
  };

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredWishlist = useMemo(() => {
    return wishlist.filter((book) => {
      const searchText =
        `${book.title} ${book.author} ${book.category}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "available" && book.available) ||
        (filter === "unavailable" && !book.available);

      return matchesSearch && matchesFilter;
    });
  }, [wishlist, search, filter]);

  /* =====================================================
     COUNTS
  ===================================================== */

  const availableCount = wishlist.filter((book) => book.available).length;

  const unavailableCount = wishlist.filter((book) => !book.available).length;

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
              WISHLIST LIST
          ================================================= */}

          <section className="wishlist-list">
            <div className="wishlist-list-header">
              <div>
                <span>YOUR COLLECTION</span>

                <h2>Saved Books</h2>
              </div>

              <span className="wishlist-count">
                {filteredWishlist.length} books
              </span>
            </div>

            {filteredWishlist.length === 0 ? (
              <div className="wishlist-empty">
                <Heart size={32} />

                <h3>Your wishlist is empty</h3>

                <p>Browse the library and save books you want to read later.</p>

                <Link to="/books" className="wishlist-browse-btn">
                  <BookOpen size={15} />
                  Browse Books
                </Link>
              </div>
            ) : (
              <div className="wishlist-grid">
                {filteredWishlist.map((book) => (
                  <article className="wishlist-card" key={book.id}>
                    {/* Book Cover */}

                    <div className="wishlist-cover">
                      <BookOpen size={28} />

                      <span>PUSTAKALAYA</span>

                      <button
                        type="button"
                        className="wishlist-remove"
                        onClick={() => removeBook(book.id)}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Content */}

                    <div className="wishlist-card-content">
                      <div className="wishlist-card-top">
                        <span>{book.category}</span>

                        {book.available ? (
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

                      <p className="wishlist-author">{book.author}</p>

                      <div className="wishlist-isbn">ISBN: {book.isbn}</div>

                      <div className="wishlist-added">
                        Added on {formatDate(book.addedDate)}
                      </div>

                      {/* Actions */}

                      <div className="wishlist-actions">
                        <Link
                          to={`/books/${book.id}`}
                          className="wishlist-view-btn"
                        >
                          <Eye size={14} />
                          View
                        </Link>

                        {book.available && (
                          <button
                            type="button"
                            className="wishlist-borrow-btn"
                            onClick={() => addToMyBooks(book)}
                          >
                            <Plus size={14} />
                            Borrow
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
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
