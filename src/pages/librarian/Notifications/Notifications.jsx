import { Bell, Check, CheckCheck, Info, Trash2, RefreshCw } from "lucide-react";

import { useEffect, useState } from "react";

import { useAuth } from "../../../context/AuthContext";

import "./Notifications.css";

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:8083";

const NOTIFICATION_API = `${API_URL}/api/notifications`;

/* =====================================================
   TIME FORMATTER
===================================================== */

function formatNotificationTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();

  const difference = now.getTime() - date.getTime();

  const seconds = Math.floor(difference / 1000);

  const minutes = Math.floor(seconds / 60);

  const hours = Math.floor(minutes / 60);

  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =====================================================
   NOTIFICATION TYPE
===================================================== */

function getNotificationType(notification) {
  const title = String(notification?.title || "").toLowerCase();

  if (
    title.includes("approved") ||
    title.includes("success") ||
    title.includes("returned")
  ) {
    return "success";
  }

  if (
    title.includes("rejected") ||
    title.includes("not available") ||
    title.includes("overdue")
  ) {
    return "warning";
  }

  return "info";
}

/* =====================================================
   COMPONENT
===================================================== */

function Notifications() {
  const { user, loading: authLoading } = useAuth();

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  /* =====================================================
     LOAD NOTIFICATIONS
  ===================================================== */

  const loadNotifications = async (showLoading = true) => {
    if (!user?.id) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response = await fetch(`${NOTIFICATION_API}/user/${user.id}`, {
        method: "GET",

        credentials: "include",
      });

      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || data?.error || "Unable to load notifications.",
        );
      }

      const notificationList = Array.isArray(data) ? data : [];

      setNotifications(notificationList);
    } catch (err) {
      console.error("Unable to load notifications:", err);

      setError(err?.message || "Unable to load notifications.");

      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =====================================================
     LOAD AFTER AUTHENTICATION
  ===================================================== */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user?.id) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    loadNotifications();
  }, [user?.id, authLoading]);

  /* =====================================================
     MARK ONE AS READ
  ===================================================== */

  const markRead = async (id) => {
    if (!id) {
      return;
    }

    try {
      const response = await fetch(`${NOTIFICATION_API}/${id}/read`, {
        method: "PUT",

        credentials: "include",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message ||
                data?.error ||
                "Unable to mark notification as read.",
        );
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                read: true,
              }
            : notification,
        ),
      );
    } catch (err) {
      console.error("Mark notification as read error:", err);

      setError(err?.message || "Unable to mark notification as read.");
    }
  };

  /* =====================================================
     MARK ALL AS READ
     
     There is currently no backend endpoint for
     "mark all as read".
     
     Therefore we intentionally do NOT invent
     a new backend endpoint.
     
     We mark each unread notification using
     the existing /{id}/read endpoint.
  ===================================================== */

  const markAllRead = async () => {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.read,
    );

    if (unreadNotifications.length === 0) {
      return;
    }

    try {
      setError("");

      await Promise.all(
        unreadNotifications.map((notification) =>
          fetch(`${NOTIFICATION_API}/${notification.id}/read`, {
            method: "PUT",

            credentials: "include",
          }),
        ),
      );

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read: true,
        })),
      );
    } catch (err) {
      console.error("Mark all notifications as read error:", err);

      setError("Unable to mark all notifications as read.");

      /*
       * Reload from database so the UI
       * stays synchronized with backend.
       */
      await loadNotifications(false);
    }
  };

  /* =====================================================
     DELETE NOTIFICATION
     
     IMPORTANT:
     
     Your backend currently DOES NOT provide
     DELETE /api/notifications/{id}.
     
     So we must NOT send a DELETE request that
     doesn't exist.
     
     The existing delete button is therefore
     kept as a local UI action only.
  ===================================================== */

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter((notification) => notification.id !== id),
    );
  };

  /* =====================================================
     UNREAD COUNT
  ===================================================== */

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  /* =====================================================
     LOADING
  ===================================================== */

  if (authLoading || loading) {
    return (
      <div className="lib-notifications-page">
        <div className="lib-page-header">
          <div>
            <span>LIBRARY UPDATES</span>

            <h1>Notifications</h1>

            <p>Stay updated with important library activities.</p>
          </div>
        </div>

        <div className="lib-empty-notifications">
          <RefreshCw size={30} className="notification-spin" />

          <h3>Loading notifications...</h3>

          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  /* =====================================================
     NOT LOGGED IN
  ===================================================== */

  if (!user?.id) {
    return (
      <div className="lib-notifications-page">
        <div className="lib-page-header">
          <div>
            <span>LIBRARY UPDATES</span>

            <h1>Notifications</h1>

            <p>Stay updated with important library activities.</p>
          </div>
        </div>

        <div className="lib-empty-notifications">
          <Bell size={30} />

          <h3>Please login first</h3>

          <p>Your notifications are available after login.</p>
        </div>
      </div>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="lib-notifications-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="lib-page-header">
        <div>
          <span>LIBRARY UPDATES</span>

          <h1>Notifications</h1>

          <p>Stay updated with important library activities.</p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {/* REFRESH */}

          <button
            type="button"
            className="lib-notification-read-btn"
            onClick={() => loadNotifications(false)}
            disabled={refreshing}
          >
            <RefreshCw
              size={16}
              className={refreshing ? "notification-spin" : ""}
            />
            Refresh
          </button>

          {/* MARK ALL READ */}

          <button
            type="button"
            className="lib-notification-read-btn"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "10px",
            background: "rgba(220, 38, 38, 0.08)",
            color: "#dc2626",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* =================================================
          NOTIFICATION LIST
      ================================================= */}

      <div className="lib-notification-list">
        {notifications.length === 0 ? (
          <div className="lib-empty-notifications">
            <Bell size={30} />

            <h3>No notifications</h3>

            <p>You're all caught up.</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const unread = !notification.read;

            const type = getNotificationType(notification);

            return (
              <div
                className={`lib-notification-card ${unread ? "unread" : ""}`}
                key={notification.id}
              >
                {/* ICON */}

                <div className={`lib-notification-icon ${type}`}>
                  {type === "success" ? (
                    <Check size={17} />
                  ) : (
                    <Info size={17} />
                  )}
                </div>

                {/* CONTENT */}

                <div className="lib-notification-content">
                  <strong>{notification.title}</strong>

                  <p>{notification.message}</p>

                  <span>{formatNotificationTime(notification.createdAt)}</span>
                </div>

                {/* ACTIONS */}

                <div className="lib-notification-actions">
                  {unread && (
                    <button
                      type="button"
                      onClick={() => markRead(notification.id)}
                      title="Mark as read"
                    >
                      <Check size={15} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteNotification(notification.id)}
                    title="Remove from view"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Notifications;
