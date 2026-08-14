import axios from "axios";

const API_URL = "http://localhost:8083/api/auth";

/* =====================================================
   USER SIGNUP
===================================================== */

export async function signupUser(userData) {
  try {
    const response = await axios.post(`${API_URL}/signup/user`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("User signup error:", error);

    const message =
      typeof error.response?.data === "string"
        ? error.response.data
        : error.response?.data?.message;

    throw new Error(message || "Unable to create user account.");
  }
}

/* =====================================================
   LIBRARIAN SIGNUP
===================================================== */

export async function signupLibrarian(librarianData) {
  try {
    const response = await axios.post(
      `${API_URL}/signup/librarian`,
      librarianData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Librarian signup error:", error);

    const message =
      typeof error.response?.data === "string"
        ? error.response.data
        : error.response?.data?.message;

    throw new Error(message || "Unable to create librarian account.");
  }
}

/* =====================================================
   LOGIN
===================================================== */

export async function loginUser(credentials) {
  try {
    console.log("Login request:", {
      email: credentials.email,
    });

    const response = await axios.post(
      `${API_URL}/login`,
      {
        email: credentials.email,
        password: credentials.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Login successful:", response.data);

    const user = response.data;

    // Store logged-in user
    localStorage.setItem("pustakalaya_user", JSON.stringify(user));

    return user;
  } catch (error) {
    console.error("Login error:", error);

    console.error("Login status:", error.response?.status);

    console.error("Login response:", error.response?.data);

    const message =
      typeof error.response?.data === "string"
        ? error.response.data
        : error.response?.data?.message;

    throw new Error(message || "Invalid email or password.");
  }
}

/* =====================================================
   GET CURRENT USER
===================================================== */

export function getCurrentUser() {
  try {
    const storedUser = localStorage.getItem("pustakalaya_user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Unable to read current user:", error);

    localStorage.removeItem("pustakalaya_user");

    return null;
  }
}

/* =====================================================
   CHECK LOGIN
===================================================== */

export function isLoggedIn() {
  return getCurrentUser() !== null;
}

/* =====================================================
   LOGOUT
===================================================== */

export function logoutUser() {
  localStorage.removeItem("pustakalaya_user");
}

/* =====================================================
   UPDATE PROFILE
===================================================== */

export async function updateProfile(userId, userData) {
  try {
    const response = await axios.put(`${API_URL}/profile/${userId}`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const updatedUser = response.data;

    localStorage.setItem("pustakalaya_user", JSON.stringify(updatedUser));

    return updatedUser;
  } catch (error) {
    console.error("Profile update error:", error);

    const message =
      typeof error.response?.data === "string"
        ? error.response.data
        : error.response?.data?.message;

    throw new Error(message || "Unable to update profile.");
  }
}
