import axios from "axios";

/* =====================================================
   API CONFIGURATION
===================================================== */

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:8083";

const BORROW_URL = `${API_URL}/api/borrow`;

/*
 * IMPORTANT
 *
 * Pustakalaya uses Spring Boot HTTP Session.
 *
 * withCredentials: true makes sure that the browser
 * sends the JSESSIONID cookie with the request.
 */

const api = axios.create({
  baseURL: BORROW_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =====================================================
   ERROR HANDLER
===================================================== */

function getApiError(error, fallbackMessage) {
  const data = error?.response?.data;

  /* ---------------------------------------------------
     Backend returns plain text
  --------------------------------------------------- */

  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  /* ---------------------------------------------------
     Backend returns { message: "..." }
  --------------------------------------------------- */

  if (data?.message) {
    return data.message;
  }

  /* ---------------------------------------------------
     Backend returns { error: "..." }
  --------------------------------------------------- */

  if (data?.error) {
    return data.error;
  }

  /* ---------------------------------------------------
     HTTP STATUS
  --------------------------------------------------- */

  if (error?.response?.status === 400) {
    return "Unable to process the borrow request.";
  }

  if (error?.response?.status === 401) {
    return "Please log in before borrowing a book.";
  }

  if (error?.response?.status === 403) {
    return "You do not have permission to borrow this book.";
  }

  if (error?.response?.status === 404) {
    return "The book or user could not be found.";
  }

  if (error?.response?.status === 409) {
    return "This book is currently unavailable.";
  }

  /* ---------------------------------------------------
     Axios error
  --------------------------------------------------- */

  if (error?.message) {
    return error.message;
  }

  return fallbackMessage;
}

/* =====================================================
   BORROW BOOK
   POST /api/borrow/borrow
===================================================== */

export async function borrowBook(userId, bookId) {
  try {
    /* -------------------------------------------------
       VALIDATION
    ------------------------------------------------- */

    if (!userId) {
      throw new Error("User ID is required.");
    }

    if (!bookId) {
      throw new Error("Book ID is required.");
    }

    /* -------------------------------------------------
       REQUEST
    ------------------------------------------------- */

    const response = await api.post("/borrow", {
      userId: Number(userId),
      bookId: Number(bookId),
    });

    return response.data;
  } catch (error) {
    console.error(
      "POST /api/borrow/borrow failed:",
      error?.response?.data || error,
    );

    throw new Error(getApiError(error, "Unable to borrow book."));
  }
}

/* =====================================================
   RETURN BOOK
   PUT /api/borrow/return/{borrowId}
===================================================== */

export async function returnBook(borrowId) {
  try {
    if (!borrowId) {
      throw new Error("Borrow ID is required.");
    }

    const response = await api.put(`/return/${borrowId}`);

    return response.data;
  } catch (error) {
    console.error(
      "PUT /api/borrow/return failed:",
      error?.response?.data || error,
    );

    throw new Error(getApiError(error, "Unable to return book."));
  }
}

/* =====================================================
   GET USER BORROWED BOOKS
   GET /api/borrow/user/{userId}
===================================================== */

export async function getUserBorrowedBooks(userId) {
  try {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const response = await api.get(`/user/${userId}`);

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(
      "GET /api/borrow/user failed:",
      error?.response?.data || error,
    );

    throw new Error(getApiError(error, "Unable to load borrowed books."));
  }
}

/* =====================================================
   GET ACTIVE BORROWS
   GET /api/borrow/active
===================================================== */

export async function getActiveBorrows() {
  try {
    const response = await api.get("/active");

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(
      "GET /api/borrow/active failed:",
      error?.response?.data || error,
    );

    throw new Error(
      getApiError(error, "Unable to load active borrow records."),
    );
  }
}

/* =====================================================
   GET BORROW HISTORY
   GET /api/borrow/history/{userId}
===================================================== */

export async function getBorrowHistory(userId) {
  try {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const response = await api.get(`/history/${userId}`);

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(
      "GET /api/borrow/history failed:",
      error?.response?.data || error,
    );

    throw new Error(getApiError(error, "Unable to load borrow history."));
  }
}
