import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Heart,
  Library,
  UserRound,
  Bookmark,
  CheckCircle2,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import { useAuth } from "../../../context/AuthContext";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import { getUserBorrowedBooks } from "../../../services/borrowService";

import "./Dashboard.css";

function Dashboard() {
  const { user, isStudent, isTeacher } = useAuth();

  /* =====================================================
     BORROWED BOOKS FROM BACKEND
  ===================================================== */

  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [borrowLoading, setBorrowLoading] = useState(true);

  /* =====================================================
     DEMO LOCAL STORAGE DATA
     Wishlist and reservations are kept as they were.
  ===================================================== */

  const wishlist =
    JSON.parse(localStorage.getItem("pustakalaya_wishlist")) || [];

  const reservations =
    JSON.parse(localStorage.getItem("pustakalaya_reservations")) || [];

  /* =====================================================
     LOAD USER BORROWED BOOKS
  ===================================================== */

  useEffect(() => {
    const loadBorrowedBooks = async () => {
      const userId = user?.id || user?.userId;

      if (!userId) {
        setBorrowedBooks([]);
        setBorrowLoading(false);
        return;
      }

      try {
        setBorrowLoading(true);

        const data = await getUserBorrowedBooks(userId);

        console.log("BORROWED BOOKS FROM BACKEND:", data);

        /*
         * Backend should return an array.
         * We keep only actual borrowed/active records.
         */
        const records = Array.isArray(data) ? data : [];

        const formattedBooks = records
          .filter((record) => {
            const status = String(record?.status || "").toUpperCase();

            /*
             * If backend has a status, don't show returned records.
             * BORROWED and OVERDUE are considered active.
             *
             * If no status is present, keep the record because
             * the backend may return a simple borrow object.
             */
            if (!status) {
              return true;
            }

            return status === "BORROWED" || status === "OVERDUE";
          })
          .map((record) => {
            /*
             * Depending on the Borrow entity, the book may be returned
             * as:
             *
             * record.book
             *
             * or the API may return book fields directly.
             */
            const book = record?.book || record;

            return {
              id: book?.id || record?.bookId || record?.id,

              title: book?.title || record?.title || "Unknown Book",

              author: book?.author || record?.author || "Unknown Author",

              cover:
                book?.coverImage ||
                book?.cover ||
                record?.coverImage ||
                record?.cover ||
                "",

              issueDate:
                record?.borrowDate ||
                record?.issueDate ||
                record?.borrow_date ||
                "N/A",

              dueDate: record?.dueDate || record?.due_date || "N/A",

              status: record?.status || "BORROWED",
            };
          });

        setBorrowedBooks(formattedBooks);
      } catch (error) {
        console.error("Failed to load borrowed books:", error);

        setBorrowedBooks([]);
      } finally {
        setBorrowLoading(false);
      }
    };

    loadBorrowedBooks();
  }, [user?.id, user?.userId]);

  /* =====================================================
     DATE FORMATTER
  ===================================================== */

  const formatDate = (date) => {
    if (!date || date === "N/A") {
      return "N/A";
    }

    try {
      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
        return date;
      }

      return parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  /* =====================================================
     USER INITIAL
  ===================================================== */

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* =================================================
              HEADER
          ================================================= */}

          <section className="dashboard-header">
            <div className="dashboard-welcome">
              <span className="dashboard-label">
                {isTeacher ? "TEACHER DASHBOARD" : "STUDENT DASHBOARD"}
              </span>

              <h1>
                Hello, <em>{user?.name?.split(" ")[0] || "Reader"}</em>
              </h1>

              <p>
                Manage your library activity, borrowed books and personal
                collection from one place.
              </p>
            </div>
          </section>

          {/* =================================================
              STATISTICS
          ================================================= */}

          <section className="dashboard-stats">
            {/* Borrowed */}

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon borrowed">
                <BookOpen size={20} />
              </div>

              <div>
                <span>Borrowed Books</span>

                <strong>{borrowLoading ? "..." : borrowedBooks.length}</strong>
              </div>

              <Link to="/my-books">
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Due Soon */}

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon due">
                <Clock3 size={20} />
              </div>

              <div>
                <span>Due Soon</span>

                <strong>0</strong>
              </div>

              <Link to="/my-books">
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Reservations */}

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon reserved">
                <Bookmark size={20} />
              </div>

              <div>
                <span>Reservations</span>

                <strong>{reservations.length}</strong>
              </div>

              <Link to="/my-books">
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Wishlist */}

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon wishlist">
                <Heart size={20} />
              </div>

              <div>
                <span>Wishlist</span>

                <strong>{wishlist.length}</strong>
              </div>

              <Link to="/wishlist">
                <ArrowRight size={15} />
              </Link>
            </div>
          </section>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <section className="dashboard-content-grid">
            {/* =================================================
                BORROWED BOOKS
            ================================================= */}

            <div className="dashboard-section dashboard-borrowed">
              <div className="dashboard-section-header">
                <div>
                  <span>YOUR COLLECTION</span>

                  <h2>Currently Borrowed</h2>
                </div>

                <Link to="/my-books">
                  View All
                  <ArrowRight size={14} />
                </Link>
              </div>

              {borrowLoading ? (
                <div className="dashboard-empty">
                  <div className="dashboard-empty-icon">
                    <Library size={24} />
                  </div>

                  <h3>Loading borrowed books...</h3>

                  <p>Checking your library activity.</p>
                </div>
              ) : borrowedBooks.length === 0 ? (
                <div className="dashboard-empty">
                  <div className="dashboard-empty-icon">
                    <Library size={24} />
                  </div>

                  <h3>No borrowed books</h3>

                  <p>
                    You haven't borrowed any books yet. Explore the library and
                    find your next read.
                  </p>

                  <Link to="/books">
                    Browse Books
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="dashboard-book-list">
                  {borrowedBooks.slice(0, 4).map((book, index) => (
                    <div className="dashboard-book-item" key={book.id || index}>
                      <div className="dashboard-book-cover">
                        <img
                          src={
                            book.cover ||
                            "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80"
                          }
                          alt={book.title}
                        />
                      </div>

                      <div className="dashboard-book-info">
                        <h3>{book.title || "Unknown Book"}</h3>

                        <span>{book.author || "Unknown Author"}</span>

                        <div className="dashboard-book-dates">
                          <div>
                            <CalendarDays size={13} />

                            <span>Issued: {formatDate(book.issueDate)}</span>
                          </div>

                          <div>
                            <Clock3 size={13} />

                            <span>Due: {formatDate(book.dueDate)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="dashboard-book-status">
                        <CheckCircle2 size={14} />
                        Active
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div className="dashboard-section dashboard-actions-section">
              <div className="dashboard-section-header">
                <div>
                  <span>QUICK ACCESS</span>

                  <h2>Quick Actions</h2>
                </div>
              </div>

              <div className="dashboard-actions">
                {/* Browse Books */}

                <Link to="/books" className="dashboard-action-card">
                  <div className="dashboard-action-icon">
                    <BookOpen size={20} />
                  </div>

                  <div>
                    <strong>Browse Books</strong>

                    <span>Explore library collection</span>
                  </div>

                  <ArrowRight size={15} />
                </Link>

                {/* My Books */}

                <Link to="/my-books" className="dashboard-action-card">
                  <div className="dashboard-action-icon">
                    <Library size={20} />
                  </div>

                  <div>
                    <strong>My Books</strong>

                    <span>Manage borrowed books</span>
                  </div>

                  <ArrowRight size={15} />
                </Link>

                {/* Wishlist */}

                <Link to="/wishlist" className="dashboard-action-card">
                  <div className="dashboard-action-icon">
                    <Heart size={20} />
                  </div>

                  <div>
                    <strong>Wishlist</strong>

                    <span>View saved books</span>
                  </div>

                  <ArrowRight size={15} />
                </Link>

                {/* Profile */}

                <Link to="/profile" className="dashboard-action-card">
                  <div className="dashboard-action-icon">
                    <UserRound size={20} />
                  </div>

                  <div>
                    <strong>My Profile</strong>

                    <span>Manage your account</span>
                  </div>

                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </section>

          {/* =================================================
              LIBRARY INFORMATION
          ================================================= */}

          <section className="dashboard-info">
            <div className="dashboard-info-icon">
              <BookOpen size={20} />
            </div>

            <div>
              <span>PUSTAKALAYA LIBRARY</span>

              <h3>Discover your next great read.</h3>

              <p>
                Browse books, check availability, reserve titles and manage your
                personal library activity.
              </p>
            </div>

            <Link to="/books">
              Explore Library
              <ArrowRight size={15} />
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
