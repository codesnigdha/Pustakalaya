import { Routes, Route } from "react-router-dom";

/* =====================================================
   PUBLIC PAGES
===================================================== */

import Home from "./pages/public/Home/Home";
import Books from "./pages/public/Books/Books";
import BookDetails from "./pages/public/BookDetails/BookDetails";
import About from "./pages/public/About/About";
import Contact from "./pages/public/Contact/Contact";

/* =====================================================
   AUTH PAGES
===================================================== */

import Login from "./pages/auth/Login/Login";
import Signup from "./pages/auth/Signup/Signup";
import SignupUser from "./pages/auth/SignupUser/SignupUser";
import SignupLibrarian from "./pages/auth/SignupLibrarian/SignupLibrarian";

/* =====================================================
   USER PAGES
===================================================== */

import Dashboard from "./pages/user/Dashboard/Dashboard";
import MyBooks from "./pages/user/MyBooks/MyBooks";
import Wishlist from "./pages/user/Wishlist/Wishlist";
import Fines from "./pages/user/Fines/Fines";
import Profile from "./pages/user/Profile/Profile";
import Settings from "./pages/user/Settings/Settings";
import Notifications from "./pages/user/Notifications/Notifications";

/* =====================================================
   LIBRARIAN LAYOUT
===================================================== */

import LibrarianLayout from "./components/LibrarianLayout/LibrarianLayout";

/* =====================================================
   LIBRARIAN PAGES
===================================================== */

import LibrarianDashboard from "./pages/librarian/LibrarianDashboard/LibrarianDashboard";
import BooksManagement from "./pages/librarian/BooksManagement/BooksManagement";
import BorrowReturn from "./pages/librarian/BorrowReturn/BorrowReturn";
import LibrarianFines from "./pages/librarian/Fines/Fines";
import LibrarianUsers from "./pages/librarian/Users/Users";
import LibrarianNotifications from "./pages/librarian/Notifications/Notifications";
import LibrarianSettings from "./pages/librarian/Settings/Settings";

/* =====================================================
   PROTECTED ROUTE
===================================================== */

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

/* =====================================================
   APP
===================================================== */

function App() {
  return (
    <Routes>
      {/* =================================================
          PUBLIC ROUTES
      ================================================= */}

      <Route path="/" element={<Home />} />

      <Route path="/books" element={<Books />} />

      {/* BOOK DETAILS */}
      <Route path="/books/:id" element={<BookDetails />} />

      <Route path="/about" element={<About />} />

      <Route path="/contact" element={<Contact />} />

      {/* =================================================
          AUTH ROUTES
      ================================================= */}

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/signup/user" element={<SignupUser />} />

      <Route path="/signup/librarian" element={<SignupLibrarian />} />

      {/* =================================================
          USER ROUTES
      ================================================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["Student", "Teacher"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-books"
        element={
          <ProtectedRoute roles={["Student", "Teacher"]}>
            <MyBooks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wishlist"
        element={
          <ProtectedRoute roles={["Student", "Teacher"]}>
            <Wishlist />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fines"
        element={
          <ProtectedRoute roles={["Student", "Teacher"]}>
            <Fines />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* =================================================
          LIBRARIAN ROUTES
      ================================================= */}

      <Route
        path="/librarian"
        element={
          <ProtectedRoute roles={["Librarian"]}>
            <LibrarianLayout />
          </ProtectedRoute>
        }
      >
        {/* /librarian */}
        <Route index element={<LibrarianDashboard />} />

        {/* /librarian/dashboard */}
        <Route path="dashboard" element={<LibrarianDashboard />} />

        {/* /librarian/books */}
        <Route path="books" element={<BooksManagement />} />

        {/* /librarian/borrow-return */}
        <Route path="borrow-return" element={<BorrowReturn />} />

        {/* /librarian/fines */}
        <Route path="fines" element={<LibrarianFines />} />

        {/* /librarian/users */}
        <Route path="users" element={<LibrarianUsers />} />

        {/* /librarian/notifications */}
        <Route path="notifications" element={<LibrarianNotifications />} />

        {/* /librarian/settings */}
        <Route path="settings" element={<LibrarianSettings />} />
      </Route>

      {/* =================================================
          404
      ================================================= */}

      <Route
        path="*"
        element={
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "10px",
              padding: "20px",
              textAlign: "center",
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
            }}
          >
            <h1>404</h1>

            <p>Page not found.</p>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
