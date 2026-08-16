import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser, logoutUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  /* =====================================================
     CHECK EXISTING SESSION
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (!mounted) {
          return;
        }

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
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
     LOGIN
  ===================================================== */

  const login = (loggedInUser) => {
    if (!loggedInUser) {
      setUser(null);
      return;
    }

    setUser(loggedInUser);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  };

  /* =====================================================
     AUTHENTICATION STATUS
  ===================================================== */

  const isAuthenticated = !loading && Boolean(user);

  /* =====================================================
     ROLE CHECKS
  ===================================================== */

  const normalizeRole = (role) => {
    if (!role) {
      return "";
    }

    return String(role).trim().toUpperCase().replace("ROLE_", "");
  };

  const currentRole = normalizeRole(user?.role);

  const isAdmin = currentRole === "ADMIN";

  const isLibrarian = currentRole === "LIBRARIAN";

  const isStudent = currentRole === "STUDENT";

  const isTeacher = currentRole === "TEACHER";

  /* =====================================================
     PROVIDER
  ===================================================== */

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,

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
