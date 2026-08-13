import {
  BookOpen,
  CalendarDays,
  Clock3,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  History,
  IndianRupee,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import "./MyBooks.css";

const FINE_PER_DAY = 5;

function MyBooks() {
  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [activeTab, setActiveTab] = useState("borrowed");

  /* =====================================================
     LOAD BOOKS
  ===================================================== */

  useEffect(() => {
    const storedBooks = JSON.parse(
      localStorage.getItem("pustakalaya_my_books"),
    );

    if (storedBooks) {
      setBooks(storedBooks);
      return;
    }

    /*
     * Demo data for frontend development.
     */

    const demoBooks = [
      {
        id: 1,

        title: "Java Programming",

        author: "Herbert Schildt",

        category: "Programming",

        borrowDate: "2026-08-01",

        dueDate: "2026-08-10",

        returnDate: null,

        status: "borrowed",
      },

      {
        id: 2,

        title: "Database Management Systems",

        author: "Raghu Ramakrishnan",

        category: "Database",

        borrowDate: "2026-08-05",

        dueDate: "2026-08-20",

        returnDate: null,

        status: "borrowed",
      },

      {
        id: 3,

        title: "Computer Networks",

        author: "Andrew S. Tanenbaum",

        category: "Networking",

        borrowDate: "2026-07-10",

        dueDate: "2026-07-20",

        returnDate: "2026-07-25",

        status: "returned",
      },

      {
        id: 4,

        title: "Operating System Concepts",

        author: "Abraham Silberschatz",

        category: "Operating Systems",

        borrowDate: "2026-06-15",

        dueDate: "2026-06-25",

        returnDate: "2026-06-24",

        status: "returned",
      },
    ];

    localStorage.setItem("pustakalaya_my_books", JSON.stringify(demoBooks));

    setBooks(demoBooks);
  }, []);

  /* =====================================================
     DATE HELPERS
  ===================================================== */

  const getOverdueDays = (book) => {
    if (book.status !== "borrowed") {
      return 0;
    }

    const today = new Date();

    const dueDate = new Date(book.dueDate);

    today.setHours(0, 0, 0, 0);

    dueDate.setHours(0, 0, 0, 0);

    const difference = today.getTime() - dueDate.getTime();

    if (difference <= 0) {
      return 0;
    }

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  const getFine = (book) => {
    const overdueDays = getOverdueDays(book);

    return overdueDays * FINE_PER_DAY;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =====================================================
     UPDATE BOOKS
  ===================================================== */

  const updateBooks = (updatedBooks) => {
    setBooks(updatedBooks);

    localStorage.setItem("pustakalaya_my_books", JSON.stringify(updatedBooks));
  };

  /* =====================================================
     RETURN BOOK
  ===================================================== */

  const handleReturnBook = (id) => {
    const confirmReturn = window.confirm(
      "Are you sure you want to mark this book as returned?",
    );

    if (!confirmReturn) {
      return;
    }

    const updatedBooks = books.map((book) => {
      if (book.id !== id) {
        return book;
      }

      return {
        ...book,

        status: "returned",

        returnDate: new Date().toISOString().split("T")[0],
      };
    });

    updateBooks(updatedBooks);
  };

  /* =====================================================
     FILTER BOOKS
  ===================================================== */

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const overdueDays = getOverdueDays(book);

      const matchesTab =
        activeTab === "borrowed"
          ? book.status === "borrowed"
          : book.status === "returned";

      let matchesFilter = true;

      if (filter === "overdue") {
        matchesFilter = book.status === "borrowed" && overdueDays > 0;
      }

      if (filter === "due-soon") {
        matchesFilter = book.status === "borrowed" && overdueDays === 0;
      }

      if (filter === "returned") {
        matchesFilter = book.status === "returned";
      }

      const searchText =
        `${book.title} ${book.author} ${book.category}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      return matchesTab && matchesFilter && matchesSearch;
    });
  }, [books, activeTab, filter, search]);

  /* =====================================================
     SUMMARY
  ===================================================== */

  const borrowedBooks = books.filter((book) => book.status === "borrowed");

  const returnedBooks = books.filter((book) => book.status === "returned");

  const overdueBooks = borrowedBooks.filter((book) => getOverdueDays(book) > 0);

  const totalFine = borrowedBooks.reduce(
    (total, book) => total + getFine(book),
    0,
  );

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="my-books-page">
      <Navbar />

      <main className="my-books-main">
        <div className="my-books-container">
          {/* =================================================
              HEADER
          ================================================= */}

          <section className="my-books-header">
            <div>
              <span className="my-books-label">MY LIBRARY</span>

              <h1>
                My
                <em> Books.</em>
              </h1>

              <p>
                Keep track of the books you've borrowed and your reading
                history.
              </p>
            </div>

            <div className="my-books-header-icon">
              <BookOpen size={30} />
            </div>
          </section>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="my-books-summary">
            {/* Borrowed */}

            <div className="my-books-summary-card">
              <div className="my-books-summary-icon">
                <BookOpen size={18} />
              </div>

              <div>
                <span>BORROWED</span>

                <strong>{borrowedBooks.length}</strong>
              </div>
            </div>

            {/* Overdue */}

            <div className="my-books-summary-card my-books-danger">
              <div className="my-books-summary-icon">
                <AlertCircle size={18} />
              </div>

              <div>
                <span>OVERDUE</span>

                <strong>{overdueBooks.length}</strong>
              </div>
            </div>

            {/* Fine */}

            <div className="my-books-summary-card my-books-warning">
              <div className="my-books-summary-icon">
                <IndianRupee size={18} />
              </div>

              <div>
                <span>CURRENT FINE</span>

                <strong>₹{totalFine}</strong>
              </div>
            </div>

            {/* Returned */}

            <div className="my-books-summary-card my-books-success">
              <div className="my-books-summary-icon">
                <History size={18} />
              </div>

              <div>
                <span>RETURNED</span>

                <strong>{returnedBooks.length}</strong>
              </div>
            </div>
          </section>

          {/* =================================================
              TABS
          ================================================= */}

          <div className="my-books-tabs">
            <button
              className={
                activeTab === "borrowed"
                  ? "my-books-tab active"
                  : "my-books-tab"
              }
              onClick={() => {
                setActiveTab("borrowed");
                setFilter("all");
              }}
            >
              <BookOpen size={15} />
              Currently Borrowed
              <span>{borrowedBooks.length}</span>
            </button>

            <button
              className={
                activeTab === "returned"
                  ? "my-books-tab active"
                  : "my-books-tab"
              }
              onClick={() => {
                setActiveTab("returned");
                setFilter("returned");
              }}
            >
              <History size={15} />
              Borrowing History
              <span>{returnedBooks.length}</span>
            </button>
          </div>

          {/* =================================================
              CONTROLS
          ================================================= */}

          <section className="my-books-controls">
            <div className="my-books-search">
              <Search size={16} />

              <input
                type="text"
                placeholder="Search your books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="my-books-filter">
              <Filter size={15} />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Books</option>

                {activeTab === "borrowed" && (
                  <>
                    <option value="overdue">Overdue</option>

                    <option value="due-soon">Within Due Date</option>
                  </>
                )}

                {activeTab === "returned" && (
                  <option value="returned">Returned</option>
                )}
              </select>
            </div>
          </section>

          {/* =================================================
              BOOK LIST
          ================================================= */}

          <section className="my-books-list">
            <div className="my-books-list-header">
              <div>
                <span>
                  {activeTab === "borrowed"
                    ? "CURRENTLY BORROWED"
                    : "BORROWING HISTORY"}
                </span>

                <h2>Library Records</h2>
              </div>

              <span className="my-books-count">
                {filteredBooks.length} books
              </span>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="my-books-empty">
                <BookOpen size={30} />

                <h3>No books found</h3>

                <p>
                  There are no books matching your current search or filter.
                </p>
              </div>
            ) : (
              <div className="my-books-grid">
                {filteredBooks.map((book) => {
                  const overdueDays = getOverdueDays(book);

                  const fine = getFine(book);

                  return (
                    <article className="my-book-card" key={book.id}>
                      {/* Book Cover */}

                      <div className="my-book-cover">
                        <BookOpen size={28} />

                        <span>PUSTAKALAYA</span>
                      </div>

                      {/* Book Content */}

                      <div className="my-book-content">
                        <div className="my-book-top">
                          <span className="my-book-category">
                            {book.category}
                          </span>

                          {book.status === "returned" ? (
                            <span className="my-book-status returned">
                              <CheckCircle2 size={12} />
                              Returned
                            </span>
                          ) : overdueDays > 0 ? (
                            <span className="my-book-status overdue">
                              <AlertCircle size={12} />
                              Overdue
                            </span>
                          ) : (
                            <span className="my-book-status borrowed">
                              <Clock3 size={12} />
                              Borrowed
                            </span>
                          )}
                        </div>

                        <h3>{book.title}</h3>

                        <p className="my-book-author">{book.author}</p>

                        {/* Dates */}

                        <div className="my-book-details">
                          <div>
                            <CalendarDays size={14} />

                            <span>Borrowed</span>

                            <strong>{formatDate(book.borrowDate)}</strong>
                          </div>

                          <div>
                            <CalendarDays size={14} />

                            <span>
                              {book.status === "returned"
                                ? "Returned"
                                : "Due Date"}
                            </span>

                            <strong>
                              {formatDate(
                                book.status === "returned"
                                  ? book.returnDate
                                  : book.dueDate,
                              )}
                            </strong>
                          </div>
                        </div>

                        {/* Overdue/Fine */}

                        {book.status === "borrowed" && overdueDays > 0 && (
                          <div className="my-book-fine">
                            <div>
                              <AlertCircle size={14} />

                              <span>{overdueDays} overdue days</span>
                            </div>

                            <strong>₹{fine}</strong>
                          </div>
                        )}

                        {/* Return Button */}

                        {book.status === "borrowed" && (
                          <button
                            className="my-book-return-btn"
                            onClick={() => handleReturnBook(book.id)}
                          >
                            <RotateCcw size={15} />
                            Mark as Returned
                          </button>
                        )}
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

export default MyBooks;
