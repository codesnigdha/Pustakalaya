import axios from "axios";

/* =====================================================
   API CONFIGURATION
===================================================== */

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:8083";

const REQUEST_URL = `${API_URL}/api/borrow-requests`;

/*
 * Spring Boot HTTP Session
 *
 * IMPORTANT:
 * withCredentials: true sends JSESSIONID
 */

const api = axios.create({
  baseURL: REQUEST_URL,
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

  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (data?.message) {
    return data.message;
  }

  if (data?.error) {
    return data.error;
  }

  if (error?.response?.status === 401) {
    return "Please login before sending a borrow request.";
  }

  if (error?.response?.status === 403) {
    return "You do not have permission to send this request.";
  }

  if (error?.response?.status === 404) {
    return "Book not found.";
  }

  return error?.message || fallbackMessage;
}

/* =====================================================
   CREATE BORROW REQUEST
   POST /api/borrow-requests
===================================================== */

export async function createBorrowRequest(bookId) {
  try {
    if (!bookId) {
      throw new Error("Book ID is required.");
    }

    const response = await api.post("", {
      bookId: Number(bookId),
    });

    return response.data;
  } catch (error) {
    console.error(
      "POST /api/borrow-requests failed:",
      error?.response?.data || error,
    );

    throw new Error(getApiError(error, "Unable to send borrow request."));
  }
}

/* =====================================================
   GET MY BORROW REQUESTS
   GET /api/borrow-requests/my
===================================================== */

export async function getMyBorrowRequests() {
  try {
    const response = await api.get("/my");

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(
      "GET /api/borrow-requests/my failed:",
      error?.response?.data || error,
    );

    throw new Error(getApiError(error, "Unable to load your borrow requests."));
  }
}

/* =====================================================
   GET PENDING REQUESTS
   LIBRARIAN
===================================================== */

export async function getPendingBorrowRequests() {
  try {
    const response = await api.get("/pending");

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(
      "GET /api/borrow-requests/pending failed:",
      error?.response?.data || error,
    );

    throw new Error(getApiError(error, "Unable to load pending requests."));
  }
}

/* =====================================================
   GET ALL REQUESTS
   LIBRARIAN
===================================================== */

export async function getAllBorrowRequests() {
  try {
    const response = await api.get("");

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(
      "GET /api/borrow-requests failed:",
      error?.response?.data || error,
    );

    throw new Error(getApiError(error, "Unable to load borrow requests."));
  }
}

/* =====================================================
   APPROVE REQUEST
===================================================== */

export async function approveBorrowRequest(requestId, librarianId) {
  try {
    if (!requestId) {
      throw new Error("Request ID is required.");
    }

    if (!librarianId) {
      throw new Error("Librarian ID is required.");
    }

    const response = await api.put(`/${requestId}/approve/${librarianId}`);

    return response.data;
  } catch (error) {
    console.error(
      "Approve borrow request failed:",
      error?.response?.data || error,
    );

    throw new Error(getApiError(error, "Unable to approve borrow request."));
  }
}

/* =====================================================
   MARK NOT AVAILABLE
===================================================== */

export async function markBorrowRequestNotAvailable(requestId, decision) {
  try {
    if (!requestId) {
      throw new Error("Request ID is required.");
    }

    const response = await api.put(`/${requestId}/not-available`, decision);

    return response.data;
  } catch (error) {
    console.error(
      "Mark request unavailable failed:",
      error?.response?.data || error,
    );

    throw new Error(getApiError(error, "Unable to update borrow request."));
  }
}
