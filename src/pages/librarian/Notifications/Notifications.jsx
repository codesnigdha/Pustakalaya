import { Bell, Check, CheckCheck, Info, Trash2 } from "lucide-react";

import { useState } from "react";

import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Book overdue",
      message: "Rahul Roy has an overdue copy of Clean Code.",
      time: "10 minutes ago",
      type: "warning",
      unread: true,
    },
    {
      id: 2,
      title: "New user registered",
      message: "A new student account has been created.",
      time: "1 hour ago",
      type: "info",
      unread: true,
    },
    {
      id: 3,
      title: "Book returned",
      message: "Atomic Habits has been successfully returned.",
      time: "3 hours ago",
      type: "success",
      unread: false,
    },
  ]);

  const markRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              unread: false,
            }
          : notification,
      ),
    );
  };

  const markAllRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter((notification) => notification.id !== id),
    );
  };

  return (
    <div className="lib-notifications-page">
      <div className="lib-page-header">
        <div>
          <span>LIBRARY UPDATES</span>

          <h1>Notifications</h1>

          <p>Stay updated with important library activities.</p>
        </div>

        <button className="lib-notification-read-btn" onClick={markAllRead}>
          <CheckCheck size={16} />
          Mark all read
        </button>
      </div>

      <div className="lib-notification-list">
        {notifications.length === 0 ? (
          <div className="lib-empty-notifications">
            <Bell size={30} />

            <h3>No notifications</h3>

            <p>You're all caught up.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              className={`lib-notification-card ${
                notification.unread ? "unread" : ""
              }`}
              key={notification.id}
            >
              <div className={`lib-notification-icon ${notification.type}`}>
                {notification.type === "success" ? (
                  <Check size={17} />
                ) : (
                  <Info size={17} />
                )}
              </div>

              <div className="lib-notification-content">
                <strong>{notification.title}</strong>

                <p>{notification.message}</p>

                <span>{notification.time}</span>
              </div>

              <div className="lib-notification-actions">
                {notification.unread && (
                  <button
                    onClick={() => markRead(notification.id)}
                    title="Mark as read"
                  >
                    <Check size={15} />
                  </button>
                )}

                <button
                  onClick={() => deleteNotification(notification.id)}
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
