import { CircleDollarSign, CheckCircle2, Clock3, Search } from "lucide-react";

import { useState } from "react";

import "./Fines.css";

function Fines() {
  const [search, setSearch] = useState("");

  const [fines, setFines] = useState([
    {
      id: 1,
      user: "Rahul Roy",
      book: "Clean Code",
      amount: 120,
      status: "Pending",
      date: "13 Aug 2026",
    },
    {
      id: 2,
      user: "Ananya Sen",
      book: "The Great Gatsby",
      amount: 80,
      status: "Pending",
      date: "12 Aug 2026",
    },
    {
      id: 3,
      user: "Priya Das",
      book: "Atomic Habits",
      amount: 50,
      status: "Paid",
      date: "10 Aug 2026",
    },
  ]);

  const markPaid = (id) => {
    setFines((previous) =>
      previous.map((fine) =>
        fine.id === id
          ? {
              ...fine,
              status: "Paid",
            }
          : fine,
      ),
    );
  };

  const filteredFines = fines.filter((fine) =>
    `${fine.user} ${fine.book}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="lib-fines-page">
      <div className="lib-page-header">
        <div>
          <span>FINE MANAGEMENT</span>

          <h1>Library Fines</h1>

          <p>Track overdue charges and payment status.</p>
        </div>
      </div>

      <div className="lib-fine-stats">
        <div>
          <CircleDollarSign size={18} />
          <span>Total Pending</span>
          <strong>₹8,450</strong>
        </div>

        <div>
          <Clock3 size={18} />
          <span>Pending Payments</span>
          <strong>32</strong>
        </div>

        <div>
          <CheckCircle2 size={18} />
          <span>Collected This Month</span>
          <strong>₹12,800</strong>
        </div>
      </div>

      <div className="lib-search-box lib-fine-search">
        <Search size={16} />

        <input
          placeholder="Search student, teacher or book..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="lib-fine-list">
        {filteredFines.map((fine) => (
          <div className="lib-fine-card" key={fine.id}>
            <div className="lib-fine-icon">
              <CircleDollarSign size={18} />
            </div>

            <div className="lib-fine-info">
              <strong>{fine.user}</strong>

              <span>{fine.book}</span>
            </div>

            <div className="lib-fine-date">{fine.date}</div>

            <strong className="lib-fine-amount">₹{fine.amount}</strong>

            <span className={`lib-fine-status ${fine.status.toLowerCase()}`}>
              {fine.status}
            </span>

            {fine.status === "Pending" && (
              <button onClick={() => markPaid(fine.id)}>Mark Paid</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Fines;
