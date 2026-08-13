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
  AlertCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import "./Dashboard.css";

function Dashboard() {
  const { user, isStudent, isTeacher } = useAuth();

  /* =====================================================
     DEMO LOCAL STORAGE DATA
  ===================================================== */

  const borrowedBooks =
    JSON.parse(localStorage.getItem("pustakalaya_borrowed_books")) || [];

  const wishlist =
    JSON.parse(localStorage.getItem("pustakalaya_wishlist")) || [];

  const reservations =
    JSON.parse(localStorage.getItem("pustakalaya_reservations")) || [];

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
                Welcome back, <em>{user?.name?.split(" ")[0] || "Reader"}</em>
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

                <strong>{borrowedBooks.length}</strong>
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

              {borrowedBooks.length === 0 ? (
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

                            <span>Issued: {book.issueDate || "N/A"}</span>
                          </div>

                          <div>
                            <Clock3 size={13} />

                            <span>Due: {book.dueDate || "N/A"}</span>
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
