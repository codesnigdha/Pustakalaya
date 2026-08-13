import axios from "axios";

const API_URL = "http://localhost:8080/api/borrow";

/* =====================================================
   BORROW BOOK
===================================================== */

export async function borrowBook(userId, bookId) {
  try {
    const response = await axios.post(`${API_URL}/borrow`, {
      userId,
      bookId,
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to borrow book.");
  }
}

/* =====================================================
   RETURN BOOK
===================================================== */

export async function returnBook(borrowId) {
  try {
    const response = await axios.put(`${API_URL}/return/${borrowId}`);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to return book.");
  }
}

/* =====================================================
   GET USER BORROWED BOOKS
===================================================== */

export async function getUserBorrowedBooks(userId) {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Unable to load borrowed books.",
    );
  }
}

/* =====================================================
   GET ACTIVE BORROWS
===================================================== */

export async function getActiveBorrows() {
  try {
    const response = await axios.get(`${API_URL}/active`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Unable to load active borrow records.",
    );
  }
}

/* =====================================================
   GET BORROW HISTORY
===================================================== */

export async function getBorrowHistory(userId) {
  try {
    const response = await axios.get(`${API_URL}/history/${userId}`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Unable to load borrow history.",
    );
  }
}
