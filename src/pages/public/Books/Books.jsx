import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  BookOpen,
  Heart,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import "./Books.css";

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
    cover:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80",
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
    cover:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80",
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
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80",
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
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 5,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Algorithms",
    isbn: "9780262046305",
    year: 2022,
    rating: 4.8,
    totalCopies: 7,
    availableCopies: 5,
    cover:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 6,
    title: "Operating System Concepts",
    author: "Abraham Silberschatz",
    category: "Operating Systems",
    isbn: "9781119800361",
    year: 2021,
    rating: 4.5,
    totalCopies: 5,
    availableCopies: 0,
    cover:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 7,
    title: "Artificial Intelligence",
    author: "Stuart Russell",
    category: "Artificial Intelligence",
    isbn: "9780134610993",
    year: 2020,
    rating: 4.7,
    totalCopies: 4,
    availableCopies: 2,
    cover:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 8,
    title: "Java: The Complete Reference",
    author: "Herbert Schildt",
    category: "Programming",
    isbn: "9781260440232",
    year: 2020,
    rating: 4.4,
    totalCopies: 6,
    availableCopies: 3,
    cover:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 9,
    title: "Engineering Mathematics",
    author: "John Bird",
    category: "Mathematics",
    isbn: "9780415673333",
    year: 2017,
    rating: 4.3,
    totalCopies: 5,
    availableCopies: 1,
    cover:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 10,
    title: "Power of Habit",
    author: "Charles Duhigg",
    category: "Self Development",
    isbn: "9780812981605",
    year: 2012,
    rating: 4.6,
    totalCopies: 4,
    availableCopies: 4,
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 11,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Development",
    isbn: "9780735211292",
    year: 2018,
    rating: 4.9,
    totalCopies: 8,
    availableCopies: 6,
    cover:
      "https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 12,
    title: "Fundamentals of Physics",
    author: "David Halliday",
    category: "Physics",
    isbn: "9781119454199",
    year: 2018,
    rating: 4.5,
    totalCopies: 5,
    availableCopies: 0,
    cover:
      "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=500&q=80",
  },
];

const categories = [
  "All Categories",
  "Programming",
  "Database",
  "Networking",
  "Algorithms",
  "Operating Systems",
  "Artificial Intelligence",
  "Mathematics",
  "Physics",
  "Self Development",
];

function Books() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All Categories";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [availability, setAvailability] = useState("all");
  const [year, setYear] = useState("all");
  const [rating, setRating] = useState("all");
  const [sort, setSort] = useState("default");

  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredBooks = useMemo(() => {
    let result = [...books];

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((book) =>
        [book.title, book.author, book.isbn, book.category].some((value) =>
          value.toLowerCase().includes(query),
        ),
      );
    }

    if (category !== "All Categories") {
      result = result.filter((book) => book.category === category);
    }

    if (availability === "available") {
      result = result.filter((book) => book.availableCopies > 0);
    }

    if (availability === "unavailable") {
      result = result.filter((book) => book.availableCopies === 0);
    }

    if (year !== "all") {
      result = result.filter((book) => {
        if (year === "2020+") return book.year >= 2020;
        if (year === "2010-2019") return book.year >= 2010 && book.year <= 2019;
        if (year === "before-2010") return book.year < 2010;

        return true;
      });
    }

    if (rating !== "all") {
      const minimumRating = Number(rating);

      result = result.filter((book) => book.rating >= minimumRating);
    }

    if (sort === "title-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sort === "title-desc") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    if (sort === "newest") {
      result.sort((a, b) => b.year - a.year);
    }

    if (sort === "oldest") {
      result.sort((a, b) => a.year - b.year);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, category, availability, year, rating, sort]);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (category !== "All Categories") {
      params.category = category;
    }

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setAvailability("all");
    setYear("all");
    setRating("all");
    setSort("default");

    setSearchParams({});
  };

  const activeFilterCount = [
    category !== "All Categories",
    availability !== "all",
    year !== "all",
    rating !== "all",
    sort !== "default",
  ].filter(Boolean).length;

  return (
    <div className="books-page">
      <Navbar />

      {/* ================= HEADER ================= */}

      <section className="books-header">
        <div className="books-container">
          <div className="books-header-content">
            <span className="books-label">LIBRARY CATALOGUE</span>

            <h1>
              Explore Our <span>Books</span>
            </h1>

            <p>
              Discover books across different subjects, search our catalogue,
              and find your next great read.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SEARCH ================= */}

      <section className="books-search-section">
        <div className="books-container">
          <form className="books-search" onSubmit={handleSearch}>
            <Search size={20} />

            <input
              type="text"
              placeholder="Search by title, author, ISBN or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

      {/* ================= MAIN ================= */}

      <main className="books-main">
        <div className="books-container">
          {/* Mobile Filter Button */}

          <button
            className="books-mobile-filter-btn"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal size={18} />
            Filters
            {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
          </button>

          <div className="books-layout">
            {/* ================= FILTERS ================= */}

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
                  className="books-filter-close"
                  onClick={() => setFiltersOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Category */}

              <div className="books-filter-group">
                <label>Category</label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability */}

              <div className="books-filter-group">
                <label>Availability</label>

                <div className="books-radio-list">
                  <label>
                    <input
                      type="radio"
                      name="availability"
                      value="all"
                      checked={availability === "all"}
                      onChange={(e) => setAvailability(e.target.value)}
                    />
                    <span>All Books</span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="availability"
                      value="available"
                      checked={availability === "available"}
                      onChange={(e) => setAvailability(e.target.value)}
                    />
                    <span>
                      <i className="available-dot"></i>
                      Available
                    </span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="availability"
                      value="unavailable"
                      checked={availability === "unavailable"}
                      onChange={(e) => setAvailability(e.target.value)}
                    />
                    <span>
                      <i className="unavailable-dot"></i>
                      Currently Not Available
                    </span>
                  </label>
                </div>
              </div>

              {/* Year */}

              <div className="books-filter-group">
                <label>Publication Year</label>

                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="all">All Years</option>

                  <option value="2020+">2020 & Newer</option>

                  <option value="2010-2019">2010 – 2019</option>

                  <option value="before-2010">Before 2010</option>
                </select>
              </div>

              {/* Rating */}

              <div className="books-filter-group">
                <label>Minimum Rating</label>

                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="all">Any Rating</option>

                  <option value="4.5">4.5 ★ & above</option>

                  <option value="4">4 ★ & above</option>

                  <option value="3">3 ★ & above</option>
                </select>
              </div>

              {/* Reset */}

              <button className="books-reset-btn" onClick={clearFilters}>
                <RotateCcw size={15} />
                Clear All Filters
              </button>

              <button
                className="books-mobile-apply"
                onClick={() => setFiltersOpen(false)}
              >
                Apply Filters
              </button>
            </aside>

            {filtersOpen && (
              <div
                className="books-filter-overlay"
                onClick={() => setFiltersOpen(false)}
              ></div>
            )}

            {/* ================= RESULTS ================= */}

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
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="default">Recommended</option>

                      <option value="title-asc">Title A–Z</option>

                      <option value="title-desc">Title Z–A</option>

                      <option value="newest">Newest</option>

                      <option value="oldest">Oldest</option>

                      <option value="rating">Highest Rated</option>
                    </select>

                    <ChevronDown size={15} />
                  </div>
                </div>
              </div>

              {/* Results */}

              {filteredBooks.length > 0 ? (
                <div className="books-grid">
                  {filteredBooks.map((book) => {
                    const isAvailable = book.availableCopies > 0;

                    return (
                      <article className="catalog-book-card" key={book.id}>
                        <div className="catalog-book-image">
                          <img src={book.cover} alt={book.title} />

                          <span
                            className={`catalog-status ${
                              isAvailable ? "available" : "unavailable"
                            }`}
                          >
                            <span></span>

                            {isAvailable
                              ? "Available"
                              : "Currently Not Available"}
                          </span>

                          <button
                            className="catalog-wishlist"
                            title="Add to wishlist"
                          >
                            <Heart size={17} />
                          </button>
                        </div>

                        <div className="catalog-book-info">
                          <span className="catalog-category">
                            {book.category}
                          </span>

                          <h3>{book.title}</h3>

                          <p className="catalog-author">{book.author}</p>

                          <div className="catalog-meta">
                            <span>★ {book.rating}</span>

                            <span>{book.year}</span>
                          </div>

                          <div className="catalog-bottom">
                            <span className="catalog-copies">
                              {book.availableCopies}/{book.totalCopies}{" "}
                              available
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
              ) : (
                <div className="books-empty">
                  <div className="books-empty-icon">
                    <BookOpen size={35} />
                  </div>

                  <h3>No Books Found</h3>

                  <p>Try changing your search or clearing some filters.</p>

                  <button onClick={clearFilters}>Clear Filters</button>
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
