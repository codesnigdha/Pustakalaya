import {
  ArrowLeftRight,
  CheckCircle2,
  Clock3,
  Search,
  X,
  BookOpen,
  RefreshCw,
  AlertCircle,
  User,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import "./BorrowReturn.css";

/* =====================================================
   API
===================================================== */

const BORROW_API = "http://localhost:8083/api/borrow";

const BOOK_API = "http://localhost:8083/api/books";

const USER_API = "http://localhost:8083/api/users";

/* =====================================================
   ERROR HANDLER
===================================================== */

function getErrorMessage(error) {
  if (error?.response?.data) {
    if (typeof error.response.data === "string") {
      return error.response.data;
    }

    if (error.response.data.message) {
      return error.response.data.message;
    }

    if (error.response.data.error) {
      return error.response.data.error;
    }
  }

  if (error?.message) {
    return error.message;
  }

  return "Something went wrong.";
}

/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =====================================================
   STATUS
===================================================== */

function getStatus(record) {
  const raw = record?.status || record?.borrowStatus || "BORROWED";

  return String(raw).toUpperCase();
}

/* =====================================================
   COMPONENT
===================================================== */

export default function BorrowReturn() {
  /* =====================================================
     STATE
  ===================================================== */

  const [records, setRecords] = useState([]);

  const [books, setBooks] = useState([]);

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  const [returningId, setReturningId] = useState(null);

  const [showIssueModal, setShowIssueModal] = useState(false);

  const [issuing, setIssuing] = useState(false);

  const [issueForm, setIssueForm] = useState({
    userId: "",
    bookId: "",
  });

  /* =====================================================
     LOAD ACTIVE BORROWS
  ===================================================== */

  async function loadBorrows() {
    try {
      const response = await fetch(`${BORROW_API}/active`);

      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Unable to load borrow records.",
        );
      }

      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Borrow records error:", err);

      throw err;
    }
  }

  /* =====================================================
     LOAD BOOKS
  ===================================================== */

  async function loadBooks() {
    try {
      const response = await fetch(BOOK_API);

      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error("Unable to load books.");
      }

      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Books error:", err);

      throw err;
    }
  }

  /* =====================================================
     LOAD USERS
  ===================================================== */

  async function loadUsers() {
    try {
      const response = await fetch(USER_API);

      if (!response.ok) {
        /*
         * User API may not exist in the
         * current backend. That should NOT
         * break the Borrow & Return page.
         */
        setUsers([]);
        return;
      }

      const data = await response.json().catch(() => []);

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("User API unavailable:", err);

      setUsers([]);
    }
  }

  /* =====================================================
     LOAD EVERYTHING
  ===================================================== */

  async function loadData(showLoader = true) {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      await Promise.all([loadBorrows(), loadBooks(), loadUsers()]);
    } catch (err) {
      console.error("Load circulation data error:", err);

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadData();
  }, []);

  /* =====================================================
     BOOK MAP
  ===================================================== */

  const bookMap = useMemo(() => {
    const map = {};

    books.forEach((book) => {
      if (book?.id != null) {
        map[String(book.id)] = book;
      }
    });

    return map;
  }, [books]);

  /* =====================================================
     USER MAP
  ===================================================== */

  const userMap = useMemo(() => {
    const map = {};

    users.forEach((user) => {
      if (user?.id != null) {
        map[String(user.id)] = user;
      }
    });

    return map;
  }, [users]);

  /* =====================================================
     GET BOOK FROM BORROW RECORD
     
     Supports:
     
     record.book
     
     OR
     
     record.bookId -> books API
  ===================================================== */

  function getBook(record) {
    if (record?.book) {
      return record.book;
    }

    const bookId = record?.bookId ?? record?.book?.id;

    if (bookId != null && bookMap[String(bookId)]) {
      return bookMap[String(bookId)];
    }

    return null;
  }

  /* =====================================================
     GET USER
     
     Supports:
     
     record.user
     
     OR
     
     record.userId -> users API
  ===================================================== */

  function getUser(record) {
    if (record?.user) {
      return record.user;
    }

    const userId = record?.userId ?? record?.user?.id;

    if (userId != null && userMap[String(userId)]) {
      return userMap[String(userId)];
    }

    return null;
  }

  /* =====================================================
     BOOK TITLE
  ===================================================== */

  function getBookTitle(record) {
    const book = getBook(record);

    if (book?.title) {
      return book.title;
    }

    const bookId = record?.bookId ?? record?.book?.id;

    if (bookId != null) {
      return `Book #${bookId}`;
    }

    return "Unknown Book";
  }

  /* =====================================================
     AUTHOR
  ===================================================== */

  function getAuthor(record) {
    const book = getBook(record);

    return book?.author || "Unknown Author";
  }

  /* =====================================================
     USER NAME
  ===================================================== */

  function getUserName(record) {
    const user = getUser(record);

    if (user) {
      return (
        user.name ||
        user.fullName ||
        user.username ||
        user.email ||
        `User #${user.id}`
      );
    }

    const userId = record?.userId ?? record?.user?.id;

    if (userId != null) {
      return `User #${userId}`;
    }

    return "Unknown User";
  }

  /* =====================================================
     USER ID
  ===================================================== */

  function getUserId(record) {
    return record?.userId ?? record?.user?.id ?? "";
  }

  /* =====================================================
     BOOK ID
  ===================================================== */

  function getBookId(record) {
    return record?.bookId ?? record?.book?.id ?? "";
  }

  /* =====================================================
     BORROW DATE
  ===================================================== */

  function getBorrowDate(record) {
    return (
      record?.borrowDate ||
      record?.issuedDate ||
      record?.issueDate ||
      record?.createdAt
    );
  }

  /* =====================================================
     DUE DATE
  ===================================================== */

  function getDueDate(record) {
    return record?.dueDate || record?.returnDueDate;
  }

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return records;
    }

    return records.filter((record) => {
      const book = getBook(record);

      const user = getUser(record);

      const title = getBookTitle(record).toLowerCase();

      const author = getAuthor(record).toLowerCase();

      const userName = getUserName(record).toLowerCase();

      const userId = String(getUserId(record)).toLowerCase();

      const bookId = String(getBookId(record)).toLowerCase();

      const isbn = String(book?.isbn || "").toLowerCase();

      const status = getStatus(record).toLowerCase();

      const borrowDate = String(getBorrowDate(record) || "").toLowerCase();

      const dueDate = String(getDueDate(record) || "").toLowerCase();

      const formattedBorrowDate = formatDate(
        getBorrowDate(record),
      ).toLowerCase();

      const formattedDueDate = formatDate(getDueDate(record)).toLowerCase();

      return (
        title.includes(query) ||
        author.includes(query) ||
        userName.includes(query) ||
        userId.includes(query) ||
        bookId.includes(query) ||
        isbn.includes(query) ||
        status.includes(query) ||
        borrowDate.includes(query) ||
        dueDate.includes(query) ||
        formattedBorrowDate.includes(query) ||
        formattedDueDate.includes(query)
      );
    });
  }, [records, books, users, bookMap, userMap, search]);

  /* =====================================================
     STATISTICS
  ===================================================== */

  const currentlyIssued = records.length;

  const overdue = records.filter(
    (record) => getStatus(record) === "OVERDUE",
  ).length;

  /*
   * Current /active endpoint does not
   * contain returned records.
   *
   * Therefore this remains 0 until
   * we add a backend endpoint for
   * today's returned books.
   */
  const returnedToday = 0;

  /* =====================================================
     REFRESH
  ===================================================== */

  async function handleRefresh() {
    setRefreshing(true);
    setSuccess("");
    setError("");

    await loadData(false);
  }

  /* =====================================================
     ISSUE FORM
  ===================================================== */

  function handleIssueChange(event) {
    const { name, value } = event.target;

    setIssueForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  /* =====================================================
     OPEN ISSUE MODAL
  ===================================================== */

  function openIssueModal() {
    setIssueForm({
      userId: "",
      bookId: "",
    });

    setError("");
    setSuccess("");

    setShowIssueModal(true);
  }

  /* =====================================================
     CLOSE ISSUE MODAL
  ===================================================== */

  function closeIssueModal() {
    if (issuing) {
      return;
    }

    setShowIssueModal(false);
  }

  /* =====================================================
     ISSUE BOOK
  ===================================================== */

  async function handleIssueBook(event) {
    event.preventDefault();

    const userId = Number(issueForm.userId);

    const bookId = Number(issueForm.bookId);

    if (!userId) {
      setError("Please enter a valid user ID.");

      return;
    }

    if (!bookId) {
      setError("Please select a book.");

      return;
    }

    try {
      setIssuing(true);

      setError("");
      setSuccess("");

      const response = await fetch(`${BORROW_API}/borrow`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          userId,
          bookId,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            (typeof data === "string" ? data : "Unable to issue book."),
        );
      }

      setSuccess("Book issued successfully.");

      setShowIssueModal(false);

      setIssueForm({
        userId: "",
        bookId: "",
      });

      await loadData(false);
    } catch (err) {
      console.error("Issue book error:", err);

      setError(getErrorMessage(err));
    } finally {
      setIssuing(false);
    }
  }

  /* =====================================================
     RETURN BOOK
  ===================================================== */

  async function handleReturn(borrowId) {
    if (!borrowId) {
      setError("Borrow record ID is missing.");

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to return this book?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setReturningId(borrowId);

      setError("");
      setSuccess("");

      const response = await fetch(`${BORROW_API}/return/${borrowId}`, {
        method: "PUT",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            (typeof data === "string" ? data : "Unable to return book."),
        );
      }

      setSuccess("Book returned successfully.");

      await loadData(false);
    } catch (err) {
      console.error("Return book error:", err);

      setError(getErrorMessage(err));
    } finally {
      setReturningId(null);
    }
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="borrow-return-page">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="borrow-page-header">
        <div>
          <div className="borrow-eyebrow">BORROW & RETURN</div>

          <h1>
            Book <span>Circulation</span>
          </h1>

          <p>Manage issued, returned and overdue books.</p>
        </div>

        <div className="borrow-header-actions">
          <button
            className="borrow-refresh-btn"
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={17} className={refreshing ? "borrow-spin" : ""} />
            Refresh
          </button>

          <button
            className="borrow-issue-btn"
            type="button"
            onClick={openIssueModal}
          >
            <ArrowLeftRight size={18} />
            Issue Book
          </button>
        </div>
      </section>

      {/* =================================================
          ALERTS
      ================================================= */}

      {error && (
        <div className="borrow-alert borrow-alert-error">
          <AlertCircle size={17} />

          <span>{error}</span>

          <button type="button" onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="borrow-alert borrow-alert-success">
          <CheckCircle2 size={17} />

          <span>{success}</span>

          <button type="button" onClick={() => setSuccess("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <section className="borrow-stat-grid">
        <div className="borrow-stat-card">
          <div className="borrow-stat-icon">
            <Clock3 size={23} />
          </div>

          <div>
            <p>Currently Issued</p>

            <strong>{currentlyIssued}</strong>
          </div>
        </div>

        <div className="borrow-stat-card">
          <div className="borrow-stat-icon">
            <CheckCircle2 size={23} />
          </div>

          <div>
            <p>Returned Today</p>

            <strong>{returnedToday}</strong>
          </div>
        </div>

        <div className="borrow-stat-card">
          <div className="borrow-stat-icon">
            <Clock3 size={23} />
          </div>

          <div>
            <p>Overdue</p>

            <strong>{overdue}</strong>
          </div>
        </div>
      </section>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="borrow-search-container">
        <Search size={22} />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search book, author, user, user ID, book ID..."
        />

        {search && (
          <button
            type="button"
            className="borrow-search-clear"
            onClick={() => setSearch("")}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* =================================================
          RESULT COUNT
      ================================================= */}

      <div className="borrow-result-line">
        {search ? (
          <>
            Showing <strong>{filteredRecords.length}</strong> of{" "}
            <strong>{records.length}</strong> records
          </>
        ) : (
          <>
            Showing <strong>{records.length}</strong> active records
          </>
        )}
      </div>

      {/* =================================================
          CIRCULATION LIST
      ================================================= */}

      <section className="borrow-list">
        {/* LIST HEADER */}

        <div className="borrow-list-header">
          <span>BOOK & MEMBER</span>

          <span>ISSUED</span>

          <span>DUE</span>

          <span>STATUS</span>

          <span>ACTION</span>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="borrow-empty">
            <RefreshCw size={30} className="borrow-spin" />

            <h3>Loading circulation records...</h3>

            <p>Please wait.</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          /* EMPTY */

          <div className="borrow-empty">
            <div className="borrow-empty-icon">
              <BookOpen size={28} />
            </div>

            <h3>
              {search ? "No matching records" : "No active borrow records"}
            </h3>

            <p>
              {search
                ? `No circulation record matches "${search}".`
                : "There are currently no books issued."}
            </p>

            {search && (
              <button type="button" onClick={() => setSearch("")}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          /* RECORDS */

          filteredRecords.map((record) => {
            const book = getBook(record);

            const user = getUser(record);

            const bookTitle = getBookTitle(record);

            const author = getAuthor(record);

            const userName = getUserName(record);

            const borrowDate = getBorrowDate(record);

            const dueDate = getDueDate(record);

            const status = getStatus(record);

            const isOverdue = status === "OVERDUE";

            const isReturning = returningId === record.id;

            return (
              <article className="borrow-record" key={record.id}>
                {/* BOOK ICON */}

                <div className="borrow-record-icon">
                  {book?.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={bookTitle}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <BookOpen size={22} />
                  )}
                </div>

                {/* BOOK + MEMBER */}

                <div className="borrow-record-main">
                  <h3>{bookTitle}</h3>

                  <p>{author}</p>

                  <div className="borrow-member">
                    <User size={13} />

                    <span>
                      Borrowed by <strong>{userName}</strong>
                    </span>
                  </div>
                </div>

                {/* ISSUED */}

                <div className="borrow-record-date">
                  <span>Issued</span>

                  <strong>{formatDate(borrowDate)}</strong>
                </div>

                {/* DUE */}

                <div className="borrow-record-date">
                  <span>Due</span>

                  <strong className={isOverdue ? "borrow-due-overdue" : ""}>
                    {formatDate(dueDate)}
                  </strong>
                </div>

                {/* STATUS */}

                <div>
                  <span
                    className={`borrow-status ${
                      isOverdue ? "overdue" : "issued"
                    }`}
                  >
                    {isOverdue ? "Overdue" : "Issued"}
                  </span>
                </div>

                {/* RETURN */}

                <button
                  type="button"
                  className="borrow-return-btn"
                  disabled={isReturning}
                  onClick={() => handleReturn(record.id)}
                >
                  {isReturning ? (
                    <>
                      <RefreshCw size={14} className="borrow-spin" />
                      Returning...
                    </>
                  ) : (
                    "Return"
                  )}
                </button>
              </article>
            );
          })
        )}
      </section>

      {/* =================================================
          ISSUE BOOK MODAL
      ================================================= */}

      {showIssueModal && (
        <div className="borrow-modal-overlay" onClick={closeIssueModal}>
          <div
            className="borrow-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="borrow-modal-header">
              <div>
                <span>BOOK CIRCULATION</span>

                <h2>Issue Book</h2>
              </div>

              <button
                type="button"
                onClick={closeIssueModal}
                disabled={issuing}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleIssueBook}>
              {/* USER */}

              <div className="borrow-form-group">
                <label>User ID</label>

                <div className="borrow-input">
                  <User size={17} />

                  <input
                    type="number"
                    name="userId"
                    min="1"
                    value={issueForm.userId}
                    onChange={handleIssueChange}
                    placeholder="Enter user ID"
                    required
                  />
                </div>
              </div>

              {/* BOOK */}

              <div className="borrow-form-group">
                <label>Book</label>

                <div className="borrow-input">
                  <BookOpen size={17} />

                  <select
                    name="bookId"
                    value={issueForm.bookId}
                    onChange={handleIssueChange}
                    required
                  >
                    <option value="">Select a book</option>

                    {books.map((book) => (
                      <option
                        key={book.id}
                        value={book.id}
                        disabled={Number(book.availableCopies || 0) <= 0}
                      >
                        {book.title} — {book.availableCopies ?? 0} available
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="borrow-modal-actions">
                <button
                  type="button"
                  className="borrow-modal-cancel"
                  onClick={closeIssueModal}
                  disabled={issuing}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="borrow-modal-submit"
                  disabled={issuing}
                >
                  {issuing ? (
                    <>
                      <RefreshCw size={15} className="borrow-spin" />
                      Issuing...
                    </>
                  ) : (
                    <>
                      <ArrowLeftRight size={16} />
                      Issue Book
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
