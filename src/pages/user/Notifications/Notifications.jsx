import {
  AlertCircle,
  Bell,
  Check,
  CheckCircle2,
  Info,
  Trash2,
} from "lucide-react";

import { useEffect, useState } from "react";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import "./Notifications.css";

const defaultNotifications = [
  {
    id: 1,
    type: "due",
    title: "Book Due Soon",
    message:
      "Your borrowed book is due soon. Please return it before the due date.",
    date: "13 Aug 2026",
    read: false,
  },
  {
    id: 2,
    type: "success",
    title: "Book Borrowed Successfully",
    message: "The book has been successfully added to your My Books section.",
    date: "12 Aug 2026",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "New Books Added",
    message:
      "New books have been added to the Pustakalaya collection. Explore the latest additions.",
    date: "10 Aug 2026",
    read: true,
  },
];

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  /* =====================================================
     LOAD NOTIFICATIONS
  ===================================================== */

  useEffect(() => {
    const stored = localStorage.getItem("pustakalaya_notifications");

    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch {
        setNotifications(defaultNotifications);

        localStorage.setItem(
          "pustakalaya_notifications",
          JSON.stringify(defaultNotifications),
        );
      }
    } else {
      setNotifications(defaultNotifications);

      localStorage.setItem(
        "pustakalaya_notifications",
        JSON.stringify(defaultNotifications),
      );
    }
  }, []);

  /* =====================================================
     SAVE TO LOCAL STORAGE
  ===================================================== */

  const saveNotifications = (updatedNotifications) => {
    setNotifications(updatedNotifications);

    localStorage.setItem(
      "pustakalaya_notifications",
      JSON.stringify(updatedNotifications),
    );
  };

  /* =====================================================
     MARK ONE AS READ
  ===================================================== */

  const markAsRead = (id) => {
    const updated = notifications.map((notification) =>
      notification.id === id
        ? {
            ...notification,
            read: true,
          }
        : notification,
    );

    saveNotifications(updated);
  };

  /* =====================================================
     MARK ALL AS READ
  ===================================================== */

  const markAllAsRead = () => {
    const updated = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    saveNotifications(updated);
  };

  /* =====================================================
     DELETE NOTIFICATION
  ===================================================== */

  const deleteNotification = (id) => {
    const updated = notifications.filter(
      (notification) => notification.id !== id,
    );

    saveNotifications(updated);
  };

  /* =====================================================
     CLEAR ALL
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

    saveNotifications([]);
  };

  /* =====================================================
     RESTORE DEMO NOTIFICATIONS
  ===================================================== */

  const restoreNotifications = () => {
    saveNotifications(defaultNotifications);
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

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

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
              {notifications.map((notification) => (
                <article
                  key={notification.id}
                  className={`notification-card ${
                    !notification.read ? "notification-unread" : ""
                  }`}
                >
                  {/* ICON */}

                  <div
                    className={`notification-icon notification-icon-${notification.type}`}
                  >
                    {getIcon(notification.type)}
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
                      {notification.date}
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
                      title="Delete notification"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              ))}
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

              <button
                type="button"
                className="notifications-restore-btn"
                onClick={restoreNotifications}
              >
                Restore Sample Notifications
              </button>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Notifications;
