import {
  AlertCircle,
  Bell,
  Check,
  CheckCircle2,
  Info,
  Trash2,
  RefreshCw,
} from "lucide-react";

import { useEffect, useState } from "react";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import { useAuth } from "../../../context/AuthContext";

import "./Notifications.css";

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:8083";

const NOTIFICATION_API = `${API_URL}/api/notifications`;

/* =====================================================
   NOTIFICATION TYPE
===================================================== */

function getNotificationType(notification) {
  const title = String(notification?.title || "").toLowerCase();

  if (
    title.includes("approved") ||
    title.includes("success") ||
    title.includes("borrowed") ||
    title.includes("returned")
  ) {
    return "success";
  }

  if (
    title.includes("rejected") ||
    title.includes("not available") ||
    title.includes("overdue") ||
    title.includes("due")
  ) {
    return "due";
  }

  return "info";
}

/* =====================================================
   DATE FORMAT
===================================================== */

function formatNotificationDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Unable to load user notifications:", err);

      setError(err?.message || "Unable to load notifications.");

      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =====================================================
     LOAD AFTER LOGIN SESSION IS READY
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

  const markAsRead = async (id) => {
    if (!id) {
      return;
    }

    try {
      setError("");

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
     
     Backend currently only provides:
     
     PUT /api/notifications/{id}/read
     
     So we use that existing endpoint for
     each unread notification.
  ===================================================== */

  const markAllAsRead = async () => {
    const unread = notifications.filter((notification) => !notification.read);

    if (unread.length === 0) {
      return;
    }

    try {
      setError("");

      await Promise.all(
        unread.map((notification) =>
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
      console.error("Mark all notifications error:", err);

      setError("Unable to mark all notifications as read.");

      await loadNotifications(false);
    }
  };

  /* =====================================================
     DELETE ONE
     
     Backend does not currently have a DELETE
     notification endpoint.
     
     Therefore this removes it only from the
     current UI.
  ===================================================== */

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter((notification) => notification.id !== id),
    );
  };

  /* =====================================================
     CLEAR ALL
     
     Same reason as above:
     no DELETE endpoint exists yet.
  ===================================================== */

  const clearAll = () => {
    if (notifications.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear all notifications?",
    );

    if (!confirmed) {
      return;
    }

    setNotifications([]);
  };

  /* =====================================================
     NOTIFICATION ICON
  ===================================================== */

  const getIcon = (type) => {
    switch (type) {
      case "due":
        return <AlertCircle size={18} />;

      case "success":
        return <CheckCircle2 size={18} />;

      default:
        return <Info size={18} />;
    }
  };

  /* =====================================================
     UNREAD COUNT
  ===================================================== */

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  /* =====================================================
     AUTH LOADING
  ===================================================== */

  if (authLoading || loading) {
    return (
      <div className="notifications-page">
        <Navbar />

        <main className="notifications-main">
          <div className="notifications-container">
            <section className="notifications-header">
              <div className="notifications-heading">
                <span className="notifications-label">LIBRARY UPDATES</span>

                <h1>
                  Your
                  <em> Notifications.</em>
                </h1>

                <p>
                  Stay updated with your books, library activity and important
                  reminders.
                </p>
              </div>

              <div className="notifications-header-icon">
                <Bell size={30} />
              </div>
            </section>

            <section className="notifications-empty">
              <RefreshCw size={28} className="notification-spin" />

              <h2>Loading Notifications</h2>

              <p>Please wait while we load your notifications.</p>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /* =====================================================
     NOT LOGGED IN
  ===================================================== */

  if (!user?.id) {
    return (
      <div className="notifications-page">
        <Navbar />

        <main className="notifications-main">
          <div className="notifications-container">
            <section className="notifications-header">
              <div className="notifications-heading">
                <span className="notifications-label">LIBRARY UPDATES</span>

                <h1>
                  Your
                  <em> Notifications.</em>
                </h1>

                <p>
                  Stay updated with your books, library activity and important
                  reminders.
                </p>
              </div>

              <div className="notifications-header-icon">
                <Bell size={30} />
              </div>
            </section>

            <section className="notifications-empty">
              <div className="notifications-empty-icon">
                <Bell size={26} />
              </div>

              <h2>Login Required</h2>

              <p>Please login to view your notifications.</p>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /* =====================================================
     MAIN UI
  ===================================================== */

  return (
    <div className="notifications-page">
      <Navbar />

      <main className="notifications-main">
        <div className="notifications-container">
          {/* =================================================
              HEADER
          ================================================= */}

          <section className="notifications-header">
            <div className="notifications-heading">
              <span className="notifications-label">LIBRARY UPDATES</span>

              <h1>
                Your
                <em> Notifications.</em>
              </h1>

              <p>
                Stay updated with your books, library activity and important
                reminders.
              </p>
            </div>

            <div className="notifications-header-icon">
              <Bell size={30} />
            </div>
          </section>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div
              style={{
                marginBottom: "18px",
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
              TOOLBAR
          ================================================= */}

          <div className="notifications-toolbar">
            <div className="notifications-count">
              <div className="notifications-count-icon">
                <Bell size={15} />
              </div>

              <div>
                <strong>{unreadCount}</strong>

                <span>
                  unread notification
                  {unreadCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="notifications-actions">
              {/* REFRESH */}

              <button
                type="button"
                className="notifications-read-all"
                onClick={() => loadNotifications(false)}
                disabled={refreshing}
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "notification-spin" : ""}
                />
                Refresh
              </button>

              {/* MARK ALL READ */}

              {unreadCount > 0 && (
                <button
                  type="button"
                  className="notifications-read-all"
                  onClick={markAllAsRead}
                >
                  <Check size={14} />
                  Mark All Read
                </button>
              )}

              {/* CLEAR ALL */}

              {notifications.length > 0 && (
                <button
                  type="button"
                  className="notifications-clear"
                  onClick={clearAll}
                >
                  <Trash2 size={14} />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          {notifications.length > 0 ? (
            <section className="notifications-list">
              {notifications.map((notification) => {
                const type = getNotificationType(notification);

                return (
                  <article
                    key={notification.id}
                    className={`notification-card ${
                      !notification.read ? "notification-unread" : ""
                    }`}
                  >
                    {/* ICON */}

                    <div
                      className={`notification-icon notification-icon-${type}`}
                    >
                      {getIcon(type)}
                    </div>

                    {/* CONTENT */}

                    <div className="notification-content">
                      <div className="notification-title-row">
                        <h3>{notification.title}</h3>

                        {!notification.read && (
                          <span className="notification-new">NEW</span>
                        )}
                      </div>

                      <p>{notification.message}</p>

                      <span className="notification-date">
                        {formatNotificationDate(notification.createdAt)}
                      </span>
                    </div>

                    {/* ACTIONS */}

                    <div className="notification-card-actions">
                      {!notification.read && (
                        <button
                          type="button"
                          className="notification-check-btn"
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <Check size={15} />
                        </button>
                      )}

                      <button
                        type="button"
                        className="notification-delete-btn"
                        onClick={() => deleteNotification(notification.id)}
                        title="Remove notification"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>
          ) : (
            /* =================================================
               EMPTY STATE
            ================================================= */

            <section className="notifications-empty">
              <div className="notifications-empty-icon">
                <Bell size={26} />
              </div>

              <h2>You're All Caught Up</h2>

              <p>
                You don't have any notifications right now. New library updates
                will appear here.
              </p>

              {/* 
                 IMPORTANT:
                 Removed "Restore Sample Notifications".
                 
                 Notifications now come from
                 the database, so we should not
                 create fake/local notifications.
              */}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Notifications;
