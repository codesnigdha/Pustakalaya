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
  LoaderCircle,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import {
  getUserBorrowedBooks,
  getBorrowHistory,
  returnBook,
} from "../../../services/borrowService";

import "./MyBooks.css";

/* =====================================================
   CONFIG
===================================================== */

const API_URL = "http://localhost:8083/api";

const FINE_PER_DAY = 5;

const USER_KEY = "pustakalaya_user";

/* =====================================================
   GET CURRENT USER
===================================================== */

function getCurrentUser() {
  try {
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Unable to read current user:", error);
    return null;
  }
}

/* =====================================================
   GET USER ID
===================================================== */

function getUserId() {
  const user = getCurrentUser();

  return user?.id ?? user?.userId ?? null;
}

/* =====================================================
   GET ARRAY FROM API RESPONSE
===================================================== */

function extractArray(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.content)) {
    return response.content;
  }

  if (Array.isArray(response?.borrowedBooks)) {
    return response.borrowedBooks;
  }

  if (Array.isArray(response?.books)) {
    return response.books;
  }

  if (Array.isArray(response?.records)) {
    return response.records;
  }

  return [];
}

/* =====================================================
   GET BOOK ID
===================================================== */

function getBookId(record) {
  if (!record) {
    return null;
  }

  const book = record.book || record.bookDetails || {};

  return (
    book?.id ??
    record.bookId ??
    record.bookID ??
    record.book?.bookId ??
    record.bookDetails?.bookId ??
    null
  );
}

/* =====================================================
   NORMALIZE BORROW RECORD
===================================================== */

function normalizeBorrowRecord(record, bookData = null) {
  if (!record) {
    return null;
  }

  const nestedBook = record.book || record.bookDetails || record.bookInfo || {};

  const book = bookData || nestedBook || {};

  const category =
    book?.category?.name ||
    book?.categoryName ||
    record?.category?.name ||
    record?.categoryName ||
    record?.category ||
    "General";

  const bookId =
    book?.id ?? nestedBook?.id ?? record?.bookId ?? record?.bookID ?? null;

  return {
    id:
      record.id ??
      record.borrowId ??
      record.borrowRecordId ??
      record.borrowingId,

    bookId,

    title:
      book?.title ||
      nestedBook?.title ||
      record?.bookTitle ||
      record?.title ||
      "Unknown Book",

    author:
      book?.author ||
      book?.authors ||
      nestedBook?.author ||
      record?.bookAuthor ||
      record?.author ||
      "Unknown Author",

    category,

    coverImage:
      book?.coverImage ||
      book?.cover_image ||
      nestedBook?.coverImage ||
      record?.coverImage ||
      "",

    isbn: book?.isbn || nestedBook?.isbn || record?.isbn || "",

    publisher:
      book?.publisher || nestedBook?.publisher || record?.publisher || "",

    publicationYear:
      book?.publicationYear ||
      nestedBook?.publicationYear ||
      record?.publicationYear ||
      null,

    borrowDate:
      record?.borrowDate ||
      record?.issueDate ||
      record?.issuedDate ||
      record?.borrowedDate ||
      record?.createdAt ||
      null,

    dueDate:
      record?.dueDate ||
      record?.returnDueDate ||
      record?.expectedReturnDate ||
      null,

    returnDate: record?.returnDate || record?.returnedDate || null,

    status: String(
      record?.status ||
        record?.borrowStatus ||
        record?.borrowingStatus ||
        "BORROWED",
    ).toLowerCase(),
  };
}

/* =====================================================
   FETCH BOOK BY ID
===================================================== */

async function fetchBookById(bookId) {
  if (!bookId) {
    return null;
  }

  try {
    const response = await axios.get(`${API_URL}/books/${bookId}`);

    return response.data;
  } catch (error) {
    console.error(`Unable to fetch book ${bookId}:`, error);

    return null;
  }
}

/* =====================================================
   ENRICH BORROW RECORDS WITH REAL BOOK DATA
===================================================== */

async function enrichBorrowRecords(records) {
  if (!records.length) {
    return [];
  }

  const enrichedRecords = await Promise.all(
    records.map(async (record) => {
      const existingBook =
        record?.book || record?.bookDetails || record?.bookInfo;

      /*
       * If the backend already returned complete
       * book information, use it directly.
       */

      if (existingBook?.title && existingBook?.author) {
        return normalizeBorrowRecord(record, existingBook);
      }

      /*
       * Otherwise get the book ID and request
       * the actual book from /api/books/{id}.
       */

      const bookId = getBookId(record);

      if (!bookId) {
        return normalizeBorrowRecord(record);
      }

      const book = await fetchBookById(bookId);

      return normalizeBorrowRecord(record, book || existingBook || {});
    }),
  );

  return enrichedRecords;
}

/* =====================================================
   COMPONENT
===================================================== */

function MyBooks() {
  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [activeTab, setActiveTab] = useState("borrowed");

  const [loading, setLoading] = useState(true);

  const [returningId, setReturningId] = useState(null);

  const [error, setError] = useState("");

  /* =====================================================
     LOAD BOOKS
  ===================================================== */

  const loadBooks = async () => {
    const userId = getUserId();

    if (!userId) {
      setBooks([]);

      setError("Please log in to view your borrowed books.");

      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      setError("");

      /* =================================================
         ACTIVE BORROWED BOOKS
      ================================================= */

      const activeResponse = await getUserBorrowedBooks(userId);

      /* =================================================
         BORROW HISTORY
      ================================================= */

      const historyResponse = await getBorrowHistory(userId);

      const activeRecords = extractArray(activeResponse);

      const historyRecords = extractArray(historyResponse);

      /* =================================================
         COMBINE RECORDS
      ================================================= */

      const combinedRecords = [...activeRecords, ...historyRecords];

      /* =================================================
         ENRICH WITH ACTUAL BOOK DATA
      ================================================= */

      const enrichedRecords = await enrichBorrowRecords(combinedRecords);

      /* =================================================
         REMOVE DUPLICATES
      ================================================= */

      const uniqueMap = new Map();

      enrichedRecords.forEach((record) => {
        if (!record) {
          return;
        }

        /*
         * Prefer borrow record ID.
         */

        const recordId = record.id ?? `${record.bookId}-${record.borrowDate}`;

        if (!uniqueMap.has(String(recordId))) {
          uniqueMap.set(String(recordId), record);
        }
      });

      setBooks(Array.from(uniqueMap.values()));
    } catch (err) {
      console.error("Unable to load My Books:", err);

      setBooks([]);

      setError(err?.message || "Unable to load your borrowed books.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadBooks();
  }, []);

  /* =====================================================
     DATE HELPERS
  ===================================================== */

  const getOverdueDays = (book) => {
    if (book.status === "returned" || book.status === "return") {
      return 0;
    }

    if (!book.dueDate) {
      return 0;
    }

    const today = new Date();

    const dueDate = new Date(book.dueDate);

    if (Number.isNaN(dueDate.getTime())) {
      return 0;
    }

    today.setHours(0, 0, 0, 0);

    dueDate.setHours(0, 0, 0, 0);

    const difference = today.getTime() - dueDate.getTime();

    if (difference <= 0) {
      return 0;
    }

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  /* =====================================================
     FINE
  ===================================================== */

  const getFine = (book) => {
    const overdueDays = getOverdueDays(book);

    return overdueDays * FINE_PER_DAY;
  };

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
     STATUS
  ===================================================== */

  const isReturned = (book) => {
    return book.status === "returned" || book.status === "return";
  };

  const isBorrowed = (book) => {
    return !isReturned(book);
  };

  /* =====================================================
     RETURN BOOK
  ===================================================== */

  const handleReturnBook = async (borrowId) => {
    if (!borrowId) {
      setError("Borrow record ID is missing.");

      return;
    }

    const confirmReturn = window.confirm(
      "Are you sure you want to return this book?",
    );

    if (!confirmReturn) {
      return;
    }

    try {
      setReturningId(borrowId);

      setError("");

      await returnBook(borrowId);

      await loadBooks();
    } catch (err) {
      console.error("Return book error:", err);

      setError(err?.message || "Unable to return the book.");
    } finally {
      setReturningId(null);
    }
  };

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredBooks = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return books.filter((book) => {
      const overdueDays = getOverdueDays(book);

      const matchesTab =
        activeTab === "borrowed" ? isBorrowed(book) : isReturned(book);

      let matchesFilter = true;

      if (filter === "overdue") {
        matchesFilter = isBorrowed(book) && overdueDays > 0;
      }

      if (filter === "due-soon") {
        matchesFilter = isBorrowed(book) && overdueDays === 0;
      }

      if (filter === "returned") {
        matchesFilter = isReturned(book);
      }

      const searchText =
        `${book.title} ${book.author} ${book.category} ${book.isbn}`.toLowerCase();

      const matchesSearch = searchText.includes(searchValue);

      return matchesTab && matchesFilter && matchesSearch;
    });
  }, [books, activeTab, filter, search]);

  /* =====================================================
     SUMMARY
  ===================================================== */

  const borrowedBooks = books.filter((book) => isBorrowed(book));

  const returnedBooks = books.filter((book) => isReturned(book));

  const overdueBooks = borrowedBooks.filter((book) => getOverdueDays(book) > 0);

  const totalFine = borrowedBooks.reduce(
    (total, book) => total + getFine(book),
    0,
  );

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="my-books-page">
        <Navbar />

        <main className="my-books-main">
          <div className="my-books-container">
            <div className="my-books-empty">
              <LoaderCircle size={30} className="my-books-loading-spinner" />

              <h3>Loading Your Books</h3>

              <p>Getting your latest library records...</p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

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
              ERROR
          ================================================= */}

          {error && (
            <div className="my-books-error">
              <AlertCircle size={16} />

              <span>{error}</span>
            </div>
          )}

          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="my-books-summary">
            <div className="my-books-summary-card">
              <div className="my-books-summary-icon">
                <BookOpen size={18} />
              </div>

              <div>
                <span>BORROWED</span>

                <strong>{borrowedBooks.length}</strong>
              </div>
            </div>

            <div className="my-books-summary-card my-books-danger">
              <div className="my-books-summary-icon">
                <AlertCircle size={18} />
              </div>

              <div>
                <span>OVERDUE</span>

                <strong>{overdueBooks.length}</strong>
              </div>
            </div>

            <div className="my-books-summary-card my-books-warning">
              <div className="my-books-summary-icon">
                <IndianRupee size={18} />
              </div>

              <div>
                <span>CURRENT FINE</span>

                <strong>₹{totalFine}</strong>
              </div>
            </div>

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
                {filteredBooks.length}{" "}
                {filteredBooks.length === 1 ? "book" : "books"}
              </span>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="my-books-empty">
                <BookOpen size={30} />

                <h3>No books found</h3>

                <p>
                  {activeTab === "borrowed"
                    ? "You don't currently have any borrowed books."
                    : "You don't have any returned books in your borrowing history."}
                </p>
              </div>
            ) : (
              <div className="my-books-grid">
                {filteredBooks.map((book) => {
                  const overdueDays = getOverdueDays(book);

                  const fine = getFine(book);

                  const returned = isReturned(book);

                  return (
                    <article
                      className="my-book-card"
                      key={book.id ?? `${book.bookId}-${book.borrowDate}`}
                    >
                      {/* =================================================
                            BOOK COVER
                        ================================================= */}

                      <div className="my-book-cover">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <>
                            <BookOpen size={28} />

                            <span>PUSTAKALAYA</span>
                          </>
                        )}
                      </div>

                      {/* =================================================
                            BOOK CONTENT
                        ================================================= */}

                      <div className="my-book-content">
                        <div className="my-book-top">
                          <span className="my-book-category">
                            {book.category}
                          </span>

                          {returned ? (
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

                        {/* BOOK TITLE */}

                        <h3>{book.title}</h3>

                        {/* AUTHOR */}

                        <p className="my-book-author">{book.author}</p>

                        {/* =================================================
                              BOOK DETAILS
                          ================================================= */}

                        <div className="my-book-details">
                          <div>
                            <CalendarDays size={14} />

                            <span>Borrowed</span>

                            <strong>{formatDate(book.borrowDate)}</strong>
                          </div>

                          <div>
                            <CalendarDays size={14} />

                            <span>{returned ? "Returned" : "Due Date"}</span>

                            <strong>
                              {formatDate(
                                returned ? book.returnDate : book.dueDate,
                              )}
                            </strong>
                          </div>
                        </div>

                        {/* =================================================
                              ISBN
                          ================================================= */}

                        {book.isbn && (
                          <div
                            style={{
                              marginTop: "8px",
                              color: "var(--text-muted)",
                              fontSize: "7px",
                            }}
                          >
                            ISBN: {book.isbn}
                          </div>
                        )}

                        {/* =================================================
                              FINE
                          ================================================= */}

                        {!returned && overdueDays > 0 && (
                          <div className="my-book-fine">
                            <div>
                              <AlertCircle size={14} />

                              <span>{overdueDays} overdue days</span>
                            </div>

                            <strong>₹{fine}</strong>
                          </div>
                        )}

                        {/* =================================================
                              RETURN BUTTON
                          ================================================= */}

                        {!returned && (
                          <button
                            className="my-book-return-btn"
                            disabled={returningId === book.id}
                            onClick={() => handleReturnBook(book.id)}
                          >
                            {returningId === book.id ? (
                              <LoaderCircle
                                size={15}
                                className="my-books-loading-spinner"
                              />
                            ) : (
                              <RotateCcw size={15} />
                            )}

                            {returningId === book.id
                              ? "Returning..."
                              : "Return Book"}
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
