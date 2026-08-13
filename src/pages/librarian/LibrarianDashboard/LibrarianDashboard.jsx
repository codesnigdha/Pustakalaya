import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BookMarked,
  CircleDollarSign,
  Clock3,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./LibrarianDashboard.css";

function LibrarianDashboard() {
  const stats = [
    {
      title: "Total Books",
      value: "2,480",
      change: "+12 this month",
      icon: BookOpen,
    },
    {
      title: "Books Issued",
      value: "186",
      change: "+8 this week",
      icon: BookMarked,
    },
    {
      title: "Registered Users",
      value: "1,240",
      change: "+24 this month",
      icon: Users,
    },
    {
      title: "Pending Fines",
      value: "₹8,450",
      change: "32 pending",
      icon: CircleDollarSign,
    },
  ];

  const recentActivities = [
    {
      name: "Aarav Sharma",
      action: "borrowed",
      book: "The Alchemist",
      time: "10 min ago",
    },
    {
      name: "Priya Das",
      action: "returned",
      book: "Atomic Habits",
      time: "35 min ago",
    },
    {
      name: "Rahul Roy",
      action: "borrowed",
      book: "Clean Code",
      time: "1 hour ago",
    },
    {
      name: "Ananya Sen",
      action: "returned",
      book: "The Great Gatsby",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="lib-dashboard">
      {/* Header */}

      <div className="lib-dashboard-header">
        <div>
          <span className="lib-dashboard-label">LIBRARIAN DASHBOARD</span>

          <h1>
            Good evening, <em>Librarian.</em>
          </h1>

          <p>Here's what's happening in your library today.</p>
        </div>

        <Link to="/librarian/books" className="lib-dashboard-action">
          Manage Books
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats */}

      <div className="lib-stat-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="lib-stat-card" key={stat.title}>
              <div className="lib-stat-top">
                <div className="lib-stat-icon">
                  <Icon size={19} />
                </div>

                <ArrowUpRight size={16} className="lib-stat-arrow" />
              </div>

              <span>{stat.title}</span>

              <strong>{stat.value}</strong>

              <small>{stat.change}</small>
            </div>
          );
        })}
      </div>

      {/* Lower */}

      <div className="lib-dashboard-grid">
        {/* Recent Activity */}

        <section className="lib-dashboard-card">
          <div className="lib-card-heading">
            <div>
              <span>ACTIVITY</span>

              <h2>Recent Activity</h2>
            </div>

            <Clock3 size={18} />
          </div>

          <div className="lib-activity-list">
            {recentActivities.map((activity, index) => (
              <div className="lib-activity" key={index}>
                <div className="lib-activity-avatar">
                  {activity.name.charAt(0).toUpperCase()}
                </div>

                <div className="lib-activity-content">
                  <p>
                    <strong>{activity.name}</strong> {activity.action}{" "}
                    <strong>{activity.book}</strong>
                  </p>

                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}

        <section className="lib-dashboard-card">
          <div className="lib-card-heading">
            <div>
              <span>QUICK ACCESS</span>

              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="lib-quick-actions">
            <Link to="/librarian/books">
              <BookOpen size={18} />

              <span>Manage Books</span>

              <ArrowRight size={15} />
            </Link>

            <Link to="/librarian/borrow-return">
              <BookMarked size={18} />

              <span>Borrow / Return</span>

              <ArrowRight size={15} />
            </Link>

            <Link to="/librarian/users">
              <Users size={18} />

              <span>Manage Users</span>

              <ArrowRight size={15} />
            </Link>

            <Link to="/librarian/fines">
              <CircleDollarSign size={18} />

              <span>View Fines</span>

              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LibrarianDashboard;
