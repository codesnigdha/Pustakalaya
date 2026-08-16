import {
  BookOpen,
  Heart,
  Search,
  Filter,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import { getCurrentUser } from "../../../services/authService";

import {
  getUserWishlist,
  removeFromWishlist,
} from "../../../services/wishlistService";

import "./Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [removingId, setRemovingId] = useState(null);

  // =====================================================
  // LOAD WISHLIST
  // =====================================================

  useEffect(() => {
    loadWishlist();
  }, []);

  // =====================================================
  // LOAD FROM BACKEND
  // =====================================================

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const user = getCurrentUser();

      if (!user || !user.id) {
        setError("Please login to view your wishlist.");

        setWishlist([]);

        return;
      }

      const data = await getUserWishlist(user.id);

      console.log("Wishlist API response:", data);

      setWishlist(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Wishlist loading error:", err);

      setError(err.message || "Unable to load wishlist.");

      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REMOVE BOOK
  // =====================================================

  const handleRemove = async (wishlistItem) => {
    const user = getCurrentUser();

    const bookId = wishlistItem?.book?.id;

    if (!user?.id) {
      alert("Please login first.");

      return;
    }

    if (!bookId) {
      alert("Book information is missing.");

      return;
    }

    try {
      setRemovingId(wishlistItem.id);

      await removeFromWishlist(user.id, bookId);

      setWishlist((previous) =>
        previous.filter((item) => item.id !== wishlistItem.id),
      );
    } catch (err) {
      console.error("Remove wishlist error:", err);

      alert(err.message || "Unable to remove book.");
    } finally {
      setRemovingId(null);
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredWishlist = useMemo(() => {
    return wishlist.filter((item) => {
      const book = item.book || {};

      const category =
        typeof book.category === "object"
          ? book.category?.name || ""
          : book.category || "";

      const searchText = `${book.title || ""}
             ${book.author || ""}
             ${category}
             ${book.isbn || ""}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const available =
        book.availableCopies != null
          ? book.availableCopies > 0
          : book.status === "AVAILABLE";

      const matchesFilter =
        filter === "all" ||
        (filter === "available" && available) ||
        (filter === "unavailable" && !available);

      return matchesSearch && matchesFilter;
    });
  }, [wishlist, search, filter]);

  // =====================================================
  // COUNTS
  // =====================================================

  const availableCount = wishlist.filter((item) => {
    const book = item.book || {};

    return book.availableCopies != null
      ? book.availableCopies > 0
      : book.status === "AVAILABLE";
  }).length;

  const unavailableCount = wishlist.length - availableCount;

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // GET CATEGORY
  // =====================================================

  const getCategory = (book) => {
    if (!book) {
      return "OTHER";
    }

    if (typeof book.category === "object") {
      return book.category?.name || "OTHER";
    }

    return book.category || "OTHER";
  };

  // =====================================================
  // GET COVER
  // =====================================================

  const getCoverImage = (book) => {
    if (!book?.coverImage) {
      return null;
    }

    return book.coverImage;
  };

  // =====================================================
  // RENDER
  // =====================================================

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
                <em> Wishlist</em>
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
                {filteredWishlist.length} books
              </span>
            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (
              <div className="wishlist-empty">
                <Heart size={32} />

                <h3>Loading wishlist...</h3>

                <p>Fetching your saved books.</p>
              </div>
            ) : error ? (
              <div className="wishlist-empty">
                <XCircle size={32} />

                <h3>Unable to load wishlist</h3>

                <p>{error}</p>

                <button
                  type="button"
                  className="wishlist-browse-btn"
                  onClick={loadWishlist}
                >
                  Try Again
                </button>
              </div>
            ) : filteredWishlist.length === 0 ? (
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
                {filteredWishlist.map((item) => {
                  const book = item.book || {};

                  const category = getCategory(book);

                  const coverImage = getCoverImage(book);

                  const available =
                    book.availableCopies != null
                      ? book.availableCopies > 0
                      : book.status === "AVAILABLE";

                  return (
                    <article className="wishlist-card" key={item.id}>
                      {/* =================================================
                            COVER
                        ================================================= */}

                      <div className="wishlist-cover">
                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt={book.title || "Book cover"}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <>
                            <BookOpen size={28} />

                            <span>PUSTAKALAYA</span>
                          </>
                        )}

                        <button
                          type="button"
                          className="wishlist-remove"
                          onClick={() => handleRemove(item)}
                          disabled={removingId === item.id}
                          title="Remove from wishlist"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* =================================================
                            CONTENT
                        ================================================= */}

                      <div className="wishlist-card-content">
                        <div className="wishlist-card-top">
                          <span>{category}</span>

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

                        <h3>{book.title || "Unknown Book"}</h3>

                        <p className="wishlist-author">
                          {book.author || "Unknown Author"}
                        </p>

                        {book.isbn && (
                          <div className="wishlist-isbn">ISBN: {book.isbn}</div>
                        )}

                        <div className="wishlist-added">
                          Added on {formatDate(item.createdAt)}
                        </div>

                        {/* =================================================
                              ACTIONS
                          ================================================= */}

                        <div className="wishlist-actions">
                          {book.id && (
                            <Link
                              to={`/books/${book.id}`}
                              className="wishlist-view-btn"
                            >
                              <Eye size={14} />
                              View
                            </Link>
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
