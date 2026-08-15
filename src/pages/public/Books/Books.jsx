import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Heart,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import { getAllBooks } from "../../../services/bookService";

import "./Books.css";

const ALL_CATEGORIES = "All Categories";

const WISHLIST_KEY = "pustakalaya_wishlist";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80";

/* =========================
   WISHLIST
========================= */

function getWishlistIds() {
  try {
    const value = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");

    return Array.isArray(value) ? value.map(Number) : [];
  } catch {
    return [];
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
   AVAILABLE COPIES
========================= */

function getAvailableCopies(book) {
  return Number(book?.availableCopies ?? 0);
}

/* =========================
   TOTAL COPIES
========================= */

function getTotalCopies(book) {
  return Number(book?.totalCopies ?? 0);
}

/* =========================
   PUBLICATION YEAR
========================= */

function getPublicationYear(book) {
  return Number(book?.publicationYear ?? 0);
}

/* =========================
   COVER
========================= */

function getCoverImage(book) {
  return book?.coverImage || DEFAULT_COVER;
}

/* =========================
   COMPONENT
========================= */

function Books() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [category, setCategory] = useState(
    searchParams.get("category") || ALL_CATEGORIES,
  );

  const [availability, setAvailability] = useState("all");

  const [year, setYear] = useState("all");

  const [sort, setSort] = useState("default");

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [wishlistIds, setWishlistIds] = useState(getWishlistIds);

  /* =========================
     LOAD BOOKS
  ========================= */

  const loadBooks = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const data = await getAllBooks();

      console.log("BOOKS FROM BACKEND:", data);

      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Unable to load books:", error);

      setBooks([]);

      setLoadError(error.message || "Unable to load books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  /* =========================
     URL PARAMETERS
  ========================= */

  useEffect(() => {
    setSearch(searchParams.get("search") || "");

    setCategory(searchParams.get("category") || ALL_CATEGORIES);
  }, [searchParams]);

  /* =========================
     WISHLIST
  ========================= */

  const toggleWishlist = (bookId) => {
    const numericId = Number(bookId);

    setWishlistIds((previous) => {
      const next = previous.includes(numericId)
        ? previous.filter((id) => id !== numericId)
        : [...previous, numericId];

      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));

      return next;
    });
  };

  /* =========================
     CATEGORIES
  ========================= */

  const categories = useMemo(() => {
    const names = books.map(getCategoryName).filter(Boolean);

    return [ALL_CATEGORIES, ...Array.from(new Set(names))];
  }, [books]);

  /* =========================
     FILTER + SORT
  ========================= */

  const filteredBooks = useMemo(() => {
    let result = [...books];

    const query = search.trim().toLowerCase();

    /* SEARCH */

    if (query) {
      result = result.filter((book) => {
        const title = String(book?.title || "").toLowerCase();

        const author = String(book?.author || "").toLowerCase();

        const isbn = String(book?.isbn || "").toLowerCase();

        const categoryName = getCategoryName(book).toLowerCase();

        return (
          title.includes(query) ||
          author.includes(query) ||
          isbn.includes(query) ||
          categoryName.includes(query)
        );
      });
    }

    /* CATEGORY */

    if (category !== ALL_CATEGORIES) {
      result = result.filter((book) => getCategoryName(book) === category);
    }

    /* AVAILABILITY */

    if (availability === "available") {
      result = result.filter((book) => getAvailableCopies(book) > 0);
    }

    if (availability === "unavailable") {
      result = result.filter((book) => getAvailableCopies(book) === 0);
    }

    /* YEAR */

    if (year === "2020+") {
      result = result.filter((book) => getPublicationYear(book) >= 2020);
    }

    if (year === "2010-2019") {
      result = result.filter((book) => {
        const value = getPublicationYear(book);

        return value >= 2010 && value <= 2019;
      });
    }

    if (year === "before-2010") {
      result = result.filter((book) => {
        const value = getPublicationYear(book);

        return value > 0 && value < 2010;
      });
    }

    /* SORT */

    if (sort === "title-asc") {
      result.sort((a, b) =>
        String(a.title || "").localeCompare(String(b.title || "")),
      );
    }

    if (sort === "title-desc") {
      result.sort((a, b) =>
        String(b.title || "").localeCompare(String(a.title || "")),
      );
    }

    if (sort === "newest") {
      result.sort((a, b) => getPublicationYear(b) - getPublicationYear(a));
    }

    if (sort === "oldest") {
      result.sort((a, b) => getPublicationYear(a) - getPublicationYear(b));
    }

    return result;
  }, [books, search, category, availability, year, sort]);

  /* =========================
     SEARCH
  ========================= */

  const handleSearch = (event) => {
    event.preventDefault();

    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (category !== ALL_CATEGORIES) {
      params.category = category;
    }

    setSearchParams(params);
  };

  /* =========================
     CLEAR FILTERS
  ========================= */

  const clearFilters = () => {
    setSearch("");
    setCategory(ALL_CATEGORIES);
    setAvailability("all");
    setYear("all");
    setSort("default");

    setSearchParams({});
  };

  const activeFilterCount = [
    category !== ALL_CATEGORIES,
    availability !== "all",
    year !== "all",
    sort !== "default",
  ].filter(Boolean).length;

  /* =========================
     UI
  ========================= */

  return (
    <div className="books-page">
      <Navbar />

      {/* HEADER */}

      <section className="books-header">
        <div className="books-container">
          <div className="books-header-content">
            <span className="books-label">LIBRARY CATALOGUE</span>

            <h1>
              Explore Our <span>Books</span>
            </h1>

            <p>
              Discover books across different subjects, check availability, and
              find your next great read.
            </p>
          </div>
        </div>
      </section>

      {/* SEARCH */}

      <section className="books-search-section">
        <div className="books-container">
          <form className="books-search" onSubmit={handleSearch}>
            <Search size={20} />

            <input
              type="text"
              placeholder="Search by title, author, ISBN or category..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <button
                type="button"
                className="books-clear-search"
                onClick={() => setSearch("")}
              >
                <X size={17} />
              </button>
            )}

            <button type="submit" className="books-search-button">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* MAIN */}

      <main className="books-main">
        <div className="books-container">
          {/* MOBILE FILTER */}

          <button
            type="button"
            className="books-mobile-filter-btn"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal size={18} />
            Filters
            {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
          </button>

          <div className="books-layout">
            {/* FILTER SIDEBAR */}

            <aside
              className={`books-filter ${
                filtersOpen ? "books-filter-open" : ""
              }`}
            >
              <div className="books-filter-header">
                <div>
                  <h3>Filters</h3>

                  {activeFilterCount > 0 && (
                    <span>{activeFilterCount} active</span>
                  )}
                </div>

                <button
                  type="button"
                  className="books-filter-close"
                  onClick={() => setFiltersOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* CATEGORY */}

              <div className="books-filter-group">
                <label>Category</label>

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* AVAILABILITY */}

              <div className="books-filter-group">
                <label>Availability</label>

                <div className="books-radio-list">
                  <label>
                    <input
                      type="radio"
                      name="availability"
                      value="all"
                      checked={availability === "all"}
                      onChange={(event) => setAvailability(event.target.value)}
                    />

                    <span>All Books</span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="availability"
                      value="available"
                      checked={availability === "available"}
                      onChange={(event) => setAvailability(event.target.value)}
                    />

                    <span>
                      <i className="available-dot" />
                      Available
                    </span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="availability"
                      value="unavailable"
                      checked={availability === "unavailable"}
                      onChange={(event) => setAvailability(event.target.value)}
                    />

                    <span>
                      <i className="unavailable-dot" />
                      Currently Not Available
                    </span>
                  </label>
                </div>
              </div>

              {/* YEAR */}

              <div className="books-filter-group">
                <label>Publication Year</label>

                <select
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                >
                  <option value="all">All Years</option>

                  <option value="2020+">2020 & Newer</option>

                  <option value="2010-2019">2010 – 2019</option>

                  <option value="before-2010">Before 2010</option>
                </select>
              </div>

              {/* RESET */}

              <button
                type="button"
                className="books-reset-btn"
                onClick={clearFilters}
              >
                <RotateCcw size={15} />
                Clear All Filters
              </button>

              <button
                type="button"
                className="books-mobile-apply"
                onClick={() => setFiltersOpen(false)}
              >
                Apply Filters
              </button>
            </aside>

            {/* OVERLAY */}

            {filtersOpen && (
              <div
                className="books-filter-overlay"
                onClick={() => setFiltersOpen(false)}
              />
            )}

            {/* RESULTS */}

            <section className="books-results">
              <div className="books-results-top">
                <div>
                  <h2>Book Catalogue</h2>

                  <p>
                    Showing <strong>{filteredBooks.length}</strong>{" "}
                    {filteredBooks.length === 1 ? "book" : "books"}
                  </p>
                </div>

                <div className="books-sort">
                  <label htmlFor="sort">Sort by</label>

                  <div className="books-sort-select">
                    <select
                      id="sort"
                      value={sort}
                      onChange={(event) => setSort(event.target.value)}
                    >
                      <option value="default">Recommended</option>

                      <option value="title-asc">Title A–Z</option>

                      <option value="title-desc">Title Z–A</option>

                      <option value="newest">Newest</option>

                      <option value="oldest">Oldest</option>
                    </select>

                    <ChevronDown size={15} />
                  </div>
                </div>
              </div>

              {/* LOADING */}

              {loading && (
                <div className="books-empty">
                  <div className="books-empty-icon">
                    <BookOpen size={35} />
                  </div>

                  <h3>Loading Books...</h3>

                  <p>Getting books from the library database.</p>
                </div>
              )}

              {/* ERROR */}

              {!loading && loadError && (
                <div className="books-empty">
                  <div className="books-empty-icon">
                    <BookOpen size={35} />
                  </div>

                  <h3>Unable to Load Books</h3>

                  <p>{loadError}</p>

                  <button type="button" onClick={loadBooks}>
                    Try Again
                  </button>
                </div>
              )}

              {/* GRID */}

              {!loading && !loadError && filteredBooks.length > 0 && (
                <div className="books-grid">
                  {filteredBooks.map((book) => {
                    const availableCopies = getAvailableCopies(book);

                    const totalCopies = getTotalCopies(book);

                    const isAvailable = availableCopies > 0;

                    const isWishlisted = wishlistIds.includes(Number(book.id));

                    const categoryName = getCategoryName(book);

                    const coverImage = getCoverImage(book);

                    const publicationYear = getPublicationYear(book);

                    return (
                      <article className="catalog-book-card" key={book.id}>
                        <div className="catalog-book-image">
                          <img
                            src={coverImage}
                            alt={book.title || "Book"}
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.onerror = null;

                              event.currentTarget.src = DEFAULT_COVER;
                            }}
                          />

                          <span
                            className={`catalog-status ${
                              isAvailable ? "available" : "unavailable"
                            }`}
                          >
                            <span />

                            {isAvailable
                              ? "Available"
                              : "Currently Not Available"}
                          </span>

                          <button
                            type="button"
                            className={`catalog-wishlist ${
                              isWishlisted ? "active" : ""
                            }`}
                            onClick={() => toggleWishlist(book.id)}
                          >
                            <Heart
                              size={17}
                              fill={isWishlisted ? "currentColor" : "none"}
                            />
                          </button>
                        </div>

                        <div className="catalog-book-info">
                          <span className="catalog-category">
                            {categoryName}
                          </span>

                          <h3>{book.title}</h3>

                          <p className="catalog-author">
                            {book.author || "Unknown Author"}
                          </p>

                          <div className="catalog-meta">
                            <span>
                              {book.isbn ? `ISBN ${book.isbn}` : "No ISBN"}
                            </span>

                            <span>{publicationYear}</span>
                          </div>

                          <div className="catalog-bottom">
                            <span className="catalog-copies">
                              {availableCopies}/{totalCopies} available
                            </span>

                            <Link
                              to={`/books/${book.id}`}
                              className="catalog-view-btn"
                            >
                              <ArrowRight size={16} />
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* EMPTY */}

              {!loading && !loadError && filteredBooks.length === 0 && (
                <div className="books-empty">
                  <div className="books-empty-icon">
                    <BookOpen size={35} />
                  </div>

                  <h3>No Books Found</h3>

                  <p>Try changing your search or clearing some filters.</p>

                  <button type="button" onClick={clearFilters}>
                    Clear Filters
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Books;
