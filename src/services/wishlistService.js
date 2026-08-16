import axios from "axios";

const API_URL = "http://localhost:8083/api/wishlist";

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

  return error.message || fallbackMessage;
}

/* =====================================================
   GET USER WISHLIST
   GET /api/wishlist/user/{userId}
===================================================== */

export async function getUserWishlist(userId) {
  try {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const response = await axios.get(`${API_URL}/user/${userId}`);

    return response.data;
  } catch (error) {
    console.error("Get wishlist error:", error);

    throw new Error(getApiError(error, "Unable to load wishlist."));
  }
}

/* =====================================================
   CHECK BOOK IN WISHLIST
   GET /api/wishlist/check/{userId}/{bookId}
===================================================== */

export async function isBookInWishlist(userId, bookId) {
  try {
    if (!userId || !bookId) {
      return false;
    }

    const response = await axios.get(`${API_URL}/check/${userId}/${bookId}`);

    return response.data === true;
  } catch (error) {
    console.error("Check wishlist error:", error);

    return false;
  }
}

/* =====================================================
   ADD BOOK TO WISHLIST
   POST /api/wishlist
===================================================== */

export async function addToWishlist(userId, bookId) {
  try {
    const response = await axios.post(
      API_URL,
      {
        userId,
        bookId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Add to wishlist error:", error);

    throw new Error(getApiError(error, "Unable to add book to wishlist."));
  }
}

/* =====================================================
   REMOVE BOOK FROM WISHLIST
   DELETE /api/wishlist/{userId}/{bookId}
===================================================== */

export async function removeFromWishlist(userId, bookId) {
  try {
    const response = await axios.delete(`${API_URL}/${userId}/${bookId}`);

    return response.data;
  } catch (error) {
    console.error("Remove from wishlist error:", error);

    throw new Error(getApiError(error, "Unable to remove book from wishlist."));
  }
}

/* =====================================================
   TOGGLE WISHLIST
   POST /api/wishlist/toggle
===================================================== */

export async function toggleWishlist(userId, bookId) {
  try {
    const response = await axios.post(
      `${API_URL}/toggle`,
      {
        userId,
        bookId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Toggle wishlist error:", error);

    throw new Error(getApiError(error, "Unable to update wishlist."));
  }
}
