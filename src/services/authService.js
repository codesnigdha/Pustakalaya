import axios from "axios";

/* =====================================================
   API CONFIGURATION
===================================================== */

const API_URL = "http://localhost:8083/api/auth";

/*
 * The browser must send the session cookie
 * created by Spring Boot.
 */
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =====================================================
   ERROR HANDLER
===================================================== */

function getApiError(error, fallbackMessage) {
  if (error.response?.data) {
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

  if (error.message) {
    return error.message;
  }

  return fallbackMessage;
}

/* =====================================================
   USER SIGNUP
   POST /api/auth/signup/user
===================================================== */

export async function signupUser(userData) {
  try {
    const response = await api.post("/signup/user", userData);

    return response.data;
  } catch (error) {
    console.error("User signup error:", error);

    throw new Error(getApiError(error, "Unable to create user account."));
  }
}

/* =====================================================
   LIBRARIAN SIGNUP
   POST /api/auth/signup/librarian
===================================================== */

export async function signupLibrarian(librarianData) {
  try {
    const response = await api.post("/signup/librarian", librarianData);

    return response.data;
  } catch (error) {
    console.error("Librarian signup error:", error);

    throw new Error(getApiError(error, "Unable to create librarian account."));
  }
}

/* =====================================================
   LOGIN
   POST /api/auth/login
===================================================== */

export async function loginUser(credentials) {
  try {
    if (!credentials?.email || !credentials.email.trim()) {
      throw new Error("Email is required.");
    }

    if (!credentials?.password) {
      throw new Error("Password is required.");
    }

    const response = await api.post("/login", {
      email: credentials.email.trim(),
      password: credentials.password,
    });

    const user = response.data;

    /* ---------------------------------------------
       Validate backend response
    --------------------------------------------- */

    if (!user || !user.id) {
      throw new Error("Invalid user data received from server.");
    }

    /*
     * IMPORTANT:
     *
     * No localStorage here.
     *
     * Spring Boot session/cookie is responsible
     * for remembering the login.
     */

    return user;
  } catch (error) {
    console.error("Login error:", error);

    throw new Error(getApiError(error, "Invalid email or password."));
  }
}

/* =====================================================
   GET CURRENT USER
   GET /api/auth/me
===================================================== */

export async function getCurrentUser() {
  try {
    const response = await api.get("/me");

    const user = response.data;

    if (!user || !user.id) {
      return null;
    }

    return user;
  } catch (error) {
    /*
     * 401/403 simply means the user
     * is not logged in.
     */

    if (error.response?.status === 401 || error.response?.status === 403) {
      return null;
    }

    console.error("Unable to get current user:", error);

    return null;
  }
}

/* =====================================================
   GET CURRENT USER ID
===================================================== */

export async function getCurrentUserId() {
  const user = await getCurrentUser();

  return user?.id || null;
}

/* =====================================================
   CHECK LOGIN
===================================================== */

export async function isLoggedIn() {
  const user = await getCurrentUser();

  return user !== null;
}

/* =====================================================
   CHECK USER ROLE
===================================================== */

export async function hasRole(role) {
  const user = await getCurrentUser();

  if (!user || !user.role) {
    return false;
  }

  return user.role === role;
}

/* =====================================================
   CHECK LIBRARIAN
===================================================== */

export async function isLibrarian() {
  return await hasRole("LIBRARIAN");
}

/* =====================================================
   CHECK STUDENT
===================================================== */

export async function isStudent() {
  return await hasRole("STUDENT");
}

/* =====================================================
   CHECK TEACHER
===================================================== */

export async function isTeacher() {
  return await hasRole("TEACHER");
}

/* =====================================================
   LOGOUT
   POST /api/auth/logout
===================================================== */

export async function logoutUser() {
  try {
    await api.post("/logout");
  } catch (error) {
    console.error("Logout error:", error);
  }
}

/* =====================================================
   UPDATE PROFILE
   PUT /api/auth/profile/{userId}
===================================================== */

export async function updateProfile(userId, userData) {
  try {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const response = await api.put(`/profile/${userId}`, userData);

    return response.data;
  } catch (error) {
    console.error("Profile update error:", error);

    throw new Error(getApiError(error, "Unable to update profile."));
  }
}

/* =====================================================
   REFRESH CURRENT USER
===================================================== */

export async function refreshCurrentUser() {
  return await getCurrentUser();
}
