import { Search, UserRound, GraduationCap, Building2 } from "lucide-react";

import { useState } from "react";

import "./Users.css";

function Users() {
  const [search, setSearch] = useState("");

  const users = [
    {
      name: "Aarav Sharma",
      email: "aarav@college.edu",
      type: "Student",
      department: "Computer Science",
      libraryId: "LIB-1001",
    },
    {
      name: "Priya Das",
      email: "priya@college.edu",
      type: "Student",
      department: "Electronics",
      libraryId: "LIB-1002",
    },
    {
      name: "Dr. Rahul Sen",
      email: "rahul@college.edu",
      type: "Teacher",
      department: "Computer Science",
      libraryId: "LIB-2001",
    },
  ];

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.department} ${user.libraryId}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="lib-users-page">
      <div className="lib-page-header">
        <div>
          <span>LIBRARY MEMBERS</span>

          <h1>Users</h1>

          <p>View students and teachers registered with the library.</p>
        </div>
      </div>

      <div className="lib-search-box lib-users-search">
        <Search size={16} />

        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="lib-users-list">
        {filteredUsers.map((user) => (
          <div className="lib-user-card" key={user.libraryId}>
            <div className="lib-user-avatar">
              {user.type === "Student" ? (
                <GraduationCap size={18} />
              ) : (
                <Building2 size={18} />
              )}
            </div>

            <div className="lib-user-main">
              <strong>{user.name}</strong>

              <span>{user.email}</span>
            </div>

            <div className="lib-user-department">{user.department}</div>

            <span className={`lib-user-type ${user.type.toLowerCase()}`}>
              {user.type}
            </span>

            <div className="lib-user-id">{user.libraryId}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;
