import axios from "axios";

const API_URL = "http://localhost:8080/api/books";

/* =====================================================
   GET ALL BOOKS
===================================================== */

export async function getAllBooks() {
  try {
    const response = await axios.get(API_URL);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to load books.");
  }
}

/* =====================================================
   GET BOOK BY ID
===================================================== */

export async function getBookById(id) {
  try {
    const response = await axios.get(`${API_URL}/${id}`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Unable to load book details.",
    );
  }
}

/* =====================================================
   SEARCH BOOKS
===================================================== */

export async function searchBooks(keyword) {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: {
        keyword,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to search books.");
  }
}

/* =====================================================
   GET BOOKS BY CATEGORY
===================================================== */

export async function getBooksByCategory(category) {
  try {
    const response = await axios.get(
      `${API_URL}/category/${encodeURIComponent(category)}`,
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Unable to load category books.",
    );
  }
}

/* =====================================================
   ADD BOOK
===================================================== */

export async function addBook(bookData) {
  try {
    const response = await axios.post(API_URL, bookData);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to add book.");
  }
}

/* =====================================================
   UPDATE BOOK
===================================================== */

export async function updateBook(id, bookData) {
  try {
    const response = await axios.put(`${API_URL}/${id}`, bookData);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to update book.");
  }
}

/* =====================================================
   DELETE BOOK
===================================================== */

export async function deleteBook(id) {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to delete book.");
  }
}
