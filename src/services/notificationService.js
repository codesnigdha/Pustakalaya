import axios from "axios";

const API_URL = "http://localhost:8080/api/notifications";

/* =====================================================
   GET USER NOTIFICATIONS
===================================================== */

export async function getUserNotifications(userId) {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Unable to load notifications.",
    );
  }
}

/* =====================================================
   GET UNREAD NOTIFICATIONS
===================================================== */

export async function getUnreadNotifications(userId) {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}/unread`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Unable to load unread notifications.",
    );
  }
}

/* =====================================================
   MARK AS READ
===================================================== */

export async function markNotificationAsRead(notificationId) {
  try {
    const response = await axios.put(`${API_URL}/${notificationId}/read`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Unable to update notification.",
    );
  }
}

/* =====================================================
   MARK ALL AS READ
===================================================== */

export async function markAllNotificationsAsRead(userId) {
  try {
    const response = await axios.put(`${API_URL}/user/${userId}/read-all`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Unable to update notifications.",
    );
  }
}

/* =====================================================
   DELETE NOTIFICATION
===================================================== */

export async function deleteNotification(notificationId) {
  try {
    const response = await axios.delete(`${API_URL}/${notificationId}`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Unable to delete notification.",
    );
  }
}
