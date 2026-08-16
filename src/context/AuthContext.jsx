import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser, logoutUser } from "../services/authService";

/* =====================================================
   AUTH CONTEXT
===================================================== */

const AuthContext = createContext(null);

/* =====================================================
   AUTH PROVIDER
===================================================== */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  /*
   * IMPORTANT:
   *
   * While we are checking the backend session,
   * authentication status is not known yet.
   */
  const [loading, setLoading] = useState(true);

  /* ===================================================
     CHECK EXISTING SESSION
  =================================================== */

  useEffect(() => {
    let mounted = true;

    async function checkAuthentication() {
      try {
        /*
         * IMPORTANT:
         *
         * getCurrentUser() is async.
         * We MUST await it.
         */
        const currentUser = await getCurrentUser();

        if (!mounted) {
          return;
        }

        /*
         * If backend session exists:
         *     currentUser = actual user
         *
         * If backend session does not exist:
         *     currentUser = null
         */
        setUser(currentUser);
      } catch (error) {
        console.error("Authentication check failed:", error);

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkAuthentication();

    return () => {
      mounted = false;
    };
  }, []);

  /* ===================================================
     LOGIN
  =================================================== */

  const login = (loggedInUser) => {
    /*
     * Login response comes directly from
     * Spring Boot.
     */
    setUser(loggedInUser);
  };

  /* ===================================================
     LOGOUT
  =================================================== */

  const logout = async () => {
    try {
      /*
       * First tell Spring Boot to destroy
       * the HTTP session.
       */
      await logoutUser();
    } finally {
      /*
       * Always clear frontend authentication state.
       *
       * This is important even if the API request
       * fails for some reason.
       */
      setUser(null);
    }
  };

  /* ===================================================
     AUTHENTICATION STATUS
  =================================================== */

  const isAuthenticated = !loading && Boolean(user);

  /* ===================================================
     ROLE CHECKS
  =================================================== */

  const isAdmin = user?.role === "ADMIN";

  const isLibrarian = user?.role === "LIBRARIAN";

  const isStudent = user?.role === "STUDENT";

  const isTeacher = user?.role === "TEACHER";

  /* ===================================================
     CONTEXT
  =================================================== */

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
