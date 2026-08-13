import {
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../../context/AuthContext";

import "./LibrarianLayout.css";

function LibrarianLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/librarian/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Books Management",
      path: "/librarian/books",
      icon: BookOpen,
    },
    {
      label: "Borrow & Return",
      path: "/librarian/borrow-return",
      icon: Library,
    },
    {
      label: "Fines",
      path: "/librarian/fines",
      icon: CircleDollarSign,
    },
    {
      label: "User Management",
      path: "/librarian/users",
      icon: Users,
    },
    {
      label: "Settings",
      path: "/librarian/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`librarian-layout ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="librarian-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`librarian-sidebar ${sidebarOpen ? "mobile-open" : ""}`}
      >
        <div className="librarian-sidebar-header">
          <div className="librarian-brand">
            <div className="librarian-brand-icon">
              <BookOpen size={21} />
            </div>

            <div className="librarian-brand-text">
              <strong>PUSTAKALAYA</strong>
              <span>Library Management</span>
            </div>
          </div>

          <button
            className="librarian-mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <nav className="librarian-nav">
          <div className="librarian-nav-title">LIBRARY</div>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `librarian-nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="librarian-sidebar-bottom">
          <div className="librarian-user">
            <div className="librarian-user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "L"}
            </div>

            <div className="librarian-user-info">
              <strong>{user?.name || "Librarian"}</strong>
              <span>{user?.role || "Librarian"}</span>
            </div>
          </div>

          <button className="librarian-logout" onClick={handleLogout}>
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>

        <button
          className="librarian-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        </button>
      </aside>

      {/* MAIN */}

      <main className="librarian-main">
        <header className="librarian-topbar">
          <button
            className="librarian-menu-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={21} />
          </button>

          <div className="librarian-topbar-title">
            <span>LIBRARY MANAGEMENT</span>
            <h1>Pustakalaya</h1>
          </div>

          <NavLink
            to="/librarian/notifications"
            className="librarian-notification-btn"
          >
            <Bell size={19} />
          </NavLink>
        </header>

        <div className="librarian-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default LibrarianLayout;
