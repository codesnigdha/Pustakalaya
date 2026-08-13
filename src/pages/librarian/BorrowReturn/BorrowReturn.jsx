import { ArrowLeftRight, CheckCircle2, Clock3, Search } from "lucide-react";

import { useState } from "react";

import "./BorrowReturn.css";

function BorrowReturn() {
  const [search, setSearch] = useState("");

  const [records, setRecords] = useState([
    {
      id: 1,
      user: "Aarav Sharma",
      book: "The Alchemist",
      date: "12 Aug 2026",
      due: "26 Aug 2026",
      status: "Issued",
    },
    {
      id: 2,
      user: "Priya Das",
      book: "Atomic Habits",
      date: "10 Aug 2026",
      due: "24 Aug 2026",
      status: "Issued",
    },
    {
      id: 3,
      user: "Rahul Roy",
      book: "Clean Code",
      date: "05 Aug 2026",
      due: "19 Aug 2026",
      status: "Overdue",
    },
  ]);

  const returnBook = (id) => {
    setRecords((previous) =>
      previous.map((record) =>
        record.id === id
          ? {
              ...record,
              status: "Returned",
            }
          : record,
      ),
    );
  };

  const filteredRecords = records.filter((record) =>
    `${record.user} ${record.book}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="lib-borrow-page">
      <div className="lib-page-header">
        <div>
          <span>BORROW & RETURN</span>

          <h1>
            Book <em>Circulation</em>
          </h1>

          <p>Manage issued, returned and overdue books.</p>
        </div>

        <button className="lib-primary-btn">
          <ArrowLeftRight size={16} />
          Issue Book
        </button>
      </div>

      <div className="lib-borrow-stats">
        <div>
          <Clock3 size={18} />
          <span>Currently Issued</span>
          <strong>186</strong>
        </div>

        <div>
          <CheckCircle2 size={18} />
          <span>Returned Today</span>
          <strong>24</strong>
        </div>

        <div>
          <Clock3 size={18} />
          <span>Overdue</span>
          <strong>12</strong>
        </div>
      </div>

      <div className="lib-search-box lib-borrow-search">
        <Search size={16} />

        <input
          placeholder="Search user or book..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="lib-borrow-list">
        {filteredRecords.map((record) => (
          <div className="lib-borrow-card" key={record.id}>
            <div className="lib-borrow-icon">
              <ArrowLeftRight size={18} />
            </div>

            <div className="lib-borrow-info">
              <strong>{record.book}</strong>

              <span>Borrowed by {record.user}</span>
            </div>

            <div className="lib-borrow-date">
              <small>Issued</small>
              <strong>{record.date}</strong>
            </div>

            <div className="lib-borrow-date">
              <small>Due</small>
              <strong>{record.due}</strong>
            </div>

            <span
              className={`lib-borrow-status ${record.status.toLowerCase()}`}
            >
              {record.status}
            </span>

            {record.status !== "Returned" && (
              <button
                className="lib-return-btn"
                onClick={() => returnBook(record.id)}
              >
                Return
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BorrowReturn;
