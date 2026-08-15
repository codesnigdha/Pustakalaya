import axios from "axios";

const API_URL = "http://localhost:8083/api/users";

/* =====================================================
   GET ALL USERS
===================================================== */

export async function getAllUsers() {
  try {
    const response = await axios.get(API_URL);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to load users.");
  }
}

/* =====================================================
   GET USER BY ID
===================================================== */

export async function getUserById(userId) {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to load user.");
  }
}

/* =====================================================
   GET USERS BY ROLE
===================================================== */

export async function getUsersByRole(role) {
  try {
    const response = await axios.get(`${API_URL}/role/${role}`);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to load users.");
  }
}

/* =====================================================
   CREATE USER
===================================================== */

export async function createUser(userData) {
  try {
    const response = await axios.post(API_URL, userData);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to create user.");
  }
}

/* =====================================================
   UPDATE USER
===================================================== */

export async function updateUser(userId, userData) {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, userData);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to update user.");
  }
}

/* =====================================================
   DELETE USER
===================================================== */

export async function deleteUser(userId) {
  try {
    const response = await axios.delete(`${API_URL}/${userId}`);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to delete user.");
  }
}

/* =====================================================
   SEARCH USERS
===================================================== */

export async function searchUsers(keyword) {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: {
        keyword,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Unable to search users.");
  }
}
