import axios from "axios";

const API_URL = "http://localhost:8083/api/fines";

/* =====================================================
   GET USER FINES
===================================================== */

export async function getUserFines(userId) {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to load fines.");
  }
}

/* =====================================================
   GET ALL FINES
===================================================== */

export async function getAllFines() {
  try {
    const response = await axios.get(API_URL);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to load fines.");
  }
}

/* =====================================================
   GET UNPAID FINES
===================================================== */

export async function getUnpaidFines() {
  try {
    const response = await axios.get(`${API_URL}/unpaid`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Unable to load unpaid fines.",
    );
  }
}

/* =====================================================
   PAY FINE
===================================================== */

export async function payFine(fineId) {
  try {
    const response = await axios.put(`${API_URL}/${fineId}/pay`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Unable to process fine payment.",
    );
  }
}

/* =====================================================
   CREATE FINE
===================================================== */

export async function createFine(fineData) {
  try {
    const response = await axios.post(API_URL, fineData);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to create fine.");
  }
}
