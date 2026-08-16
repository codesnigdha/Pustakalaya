import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser, logoutUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  /*
   * true while we are checking the Spring Boot
   * session after page load / refresh.
   */
  const [loading, setLoading] = useState(true);

  /* =====================================================
     CHECK EXISTING LOGIN SESSION
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        /*
         * IMPORTANT:
         *
         * getCurrentUser() calls:
         *
         * GET /api/auth/me
         *
         * We MUST await it.
         */
        const currentUser = await getCurrentUser();

        if (!mounted) {
          return;
        }

        /*
         * If Spring Boot session exists:
         *
         * currentUser = actual logged-in user
         *
         * If session doesn't exist:
         *
         * currentUser = null
         */
        setUser(currentUser);
      } catch (error) {
        console.error("Authentication check failed:", error);

        if (mounted) {
          setUser(null);
        }
      } finally {
        /*
         * Authentication check is finished.
         */
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    /*
     * Prevent state updates if the component
     * is unmounted while the request is running.
     */
    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
     LOGIN
  ===================================================== */

  const login = (loggedInUser) => {
    /*
     * Store the user in React state.
     *
     * The actual session is maintained by
     * Spring Boot through the session cookie.
     */
    setUser(loggedInUser);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = async () => {
    try {
      /*
       * Tell Spring Boot to invalidate the session.
       */
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      /*
       * Always clear the frontend state,
       * even if the backend request fails.
       */
      setUser(null);
    }
  };

  /* =====================================================
     AUTHENTICATION STATUS
  ===================================================== */

  /*
   * Do NOT consider the user authenticated while
   * the initial session check is still running.
   */
  const isAuthenticated = !loading && Boolean(user);

  /* =====================================================
     ROLE CHECKS
  ===================================================== */

  const isAdmin = user?.role === "ADMIN";

  const isLibrarian = user?.role === "LIBRARIAN";

  const isStudent = user?.role === "STUDENT";

  const isTeacher = user?.role === "TEACHER";

  /* =====================================================
     PROVIDER
  ===================================================== */

  return (
    <AuthContext.Provider
      value={{
        user,

        loading,

        login,

        logout,

        isAuthenticated,

        isAdmin,

        isLibrarian,

        isStudent,

        isTeacher,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =====================================================
   USE AUTH
===================================================== */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
