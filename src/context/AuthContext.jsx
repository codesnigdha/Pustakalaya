import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser, logoutUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();

    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const isAuthenticated = Boolean(user);

  const isAdmin = user?.role === "Admin";

  const isLibrarian = user?.role === "Librarian";

  const isStudent = user?.role === "Student";

  const isTeacher = user?.role === "Teacher";

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

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
