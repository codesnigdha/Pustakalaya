import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:8083";

const BOOKS_URL = `${API_URL}/api/books`;

/* =====================================================
   ERROR HANDLER
===================================================== */

function getApiError(error, fallbackMessage) {
  const data = error?.response?.data;

  // ---------------------------------------------------
  // Backend returns a simple string
  // ---------------------------------------------------

  if (typeof data === "string" && data.trim()) {
    const message = data.trim();

    // -------------------------------------------------
    // Convert old MySQL foreign-key error
    // -------------------------------------------------

    if (
      message.includes("Cannot delete or update a parent row") ||
      message.includes("foreign key constraint fails") ||
      message.includes("borrows")
    ) {
      return "Unable to delete this book because it has been borrowed by someone.";
    }

    return message;
  }

  // ---------------------------------------------------
  // Backend returns { message: "..." }
  // ---------------------------------------------------

  if (data?.message) {
    if (
      data.message.includes("Cannot delete or update a parent row") ||
      data.message.includes("foreign key constraint fails")
    ) {
      return "Unable to delete this book because it has been borrowed by someone.";
    }

    return data.message;
  }

  // ---------------------------------------------------
  // Backend returns { error: "..." }
  // ---------------------------------------------------

  if (data?.error) {
    if (
      data.error.includes("Cannot delete or update a parent row") ||
      data.error.includes("foreign key constraint fails")
    ) {
      return "Unable to delete this book because it has been borrowed by someone.";
    }

    return data.error;
  }

  // ---------------------------------------------------
  // Axios error
  // ---------------------------------------------------

  if (error?.message) {
    return error.message;
  }

  return fallbackMessage;
}

/* =====================================================
   GET ALL BOOKS
===================================================== */

export async function getAllBooks() {
  try {
    const response = await axios.get(BOOKS_URL);

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("GET /api/books:", error);

    throw new Error(getApiError(error, "Unable to load books."));
  }
}

/* =====================================================
   GET BOOK BY ID
===================================================== */

export async function getBookById(id) {
  if (!id) {
    throw new Error("Book ID is required.");
  }

  try {
    const response = await axios.get(`${BOOKS_URL}/${id}`);

    return response.data;
  } catch (error) {
    console.error(`GET /api/books/${id}:`, error);

    throw new Error(getApiError(error, "Unable to load book details."));
  }
}

/* =====================================================
   SEARCH BOOKS
===================================================== */

export async function searchBooks(keyword = "") {
  try {
    const response = await axios.get(`${BOOKS_URL}/search`, {
      params: {
        keyword: keyword.trim(),
      },
    });

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("GET /api/books/search:", error);

    throw new Error(getApiError(error, "Unable to search books."));
  }
}

/* =====================================================
   BOOKS BY CATEGORY
===================================================== */

export async function getBooksByCategory(categoryId) {
  if (!categoryId) {
    throw new Error("Category ID is required.");
  }

  try {
    const response = await axios.get(`${BOOKS_URL}/category/${categoryId}`);

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("GET /api/books/category:", error);

    throw new Error(getApiError(error, "Unable to load category books."));
  }
}

/* =====================================================
   ADD BOOK
===================================================== */

export async function addBook(bookData) {
  try {
    const response = await axios.post(BOOKS_URL, bookData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("POST /api/books:", error);

    throw new Error(getApiError(error, "Unable to add book."));
  }
}

/* =====================================================
   UPDATE BOOK
===================================================== */

export async function updateBook(id, bookData) {
  if (!id) {
    throw new Error("Book ID is required.");
  }

  try {
    const response = await axios.put(`${BOOKS_URL}/${id}`, bookData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error(`PUT /api/books/${id}:`, error);

    throw new Error(getApiError(error, "Unable to update book."));
  }
}

/* =====================================================
   DELETE BOOK
===================================================== */

export async function deleteBook(id) {
  if (!id) {
    throw new Error("Book ID is required.");
  }

  try {
    const response = await axios.delete(`${BOOKS_URL}/${id}`);

    return response.data;
  } catch (error) {
    console.error(`DELETE /api/books/${id}:`, error);

    throw new Error(getApiError(error, "Unable to delete book."));
  }
}
