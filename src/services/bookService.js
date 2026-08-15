import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:8083";

const BOOKS_URL = `${API_URL}/api/books`;

function getApiError(error, fallbackMessage) {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data?.message) {
    return data.message;
  }

  if (data?.error) {
    return data.error;
  }

  if (error?.message) {
    return error.message;
  }

  return fallbackMessage;
}

/* =========================
   GET ALL BOOKS
========================= */

export async function getAllBooks() {
  try {
    const response = await axios.get(BOOKS_URL);

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("GET /api/books:", error);

    throw new Error(getApiError(error, "Unable to load books."));
  }
}

/* =========================
   GET BOOK BY ID
========================= */

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

/* =========================
   SEARCH BOOKS
========================= */

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

/* =========================
   BOOKS BY CATEGORY
========================= */

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

/* =========================
   ADD BOOK
========================= */

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

/* =========================
   UPDATE BOOK
========================= */

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

/* =========================
   DELETE BOOK
========================= */

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
