import {
  IndianRupee,
  AlertCircle,
  CheckCircle2,
  Clock3,
  BookOpen,
  Search,
  Filter,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import "./Fines.css";

const FINE_PER_DAY = 5;

function Fines() {
  const [fines, setFines] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  /* =====================================================
     LOAD FINES
  ===================================================== */

  useEffect(() => {
    const storedFines = JSON.parse(localStorage.getItem("pustakalaya_fines"));

    if (storedFines) {
      setFines(storedFines);
    } else {
      /*
       * Demo data for frontend development.
       * Remove this later when real borrowing data is added.
       */

      const demoFines = [
        {
          id: 1,
          bookTitle: "Java Programming",
          author: "Herbert Schildt",
          borrowDate: "2026-07-25",
          dueDate: "2026-08-05",
          returnDate: null,
          overdueDays: 6,
          finePerDay: FINE_PER_DAY,
          amount: 30,
          status: "unpaid",
        },
        {
          id: 2,
          bookTitle: "Database Management Systems",
          author: "Raghu Ramakrishnan",
          borrowDate: "2026-07-20",
          dueDate: "2026-08-01",
          returnDate: "2026-08-10",
          overdueDays: 9,
          finePerDay: FINE_PER_DAY,
          amount: 45,
          status: "paid",
        },
        {
          id: 3,
          bookTitle: "Computer Networks",
          author: "Andrew S. Tanenbaum",
          borrowDate: "2026-08-01",
          dueDate: "2026-08-15",
          returnDate: null,
          overdueDays: 0,
          finePerDay: FINE_PER_DAY,
          amount: 0,
          status: "clear",
        },
      ];

      localStorage.setItem("pustakalaya_fines", JSON.stringify(demoFines));

      setFines(demoFines);
    }
  }, []);

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredFines = useMemo(() => {
    return fines.filter((fine) => {
      const matchesSearch =
        fine.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
        fine.author.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "all" || fine.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [fines, search, filter]);

  /* =====================================================
     TOTALS
  ===================================================== */

  const totalFine = fines.reduce(
    (total, fine) => total + Number(fine.amount || 0),
    0,
  );

  const unpaidFine = fines
    .filter((fine) => fine.status === "unpaid")
    .reduce((total, fine) => total + Number(fine.amount || 0), 0);

  const paidFine = fines
    .filter((fine) => fine.status === "paid")
    .reduce((total, fine) => total + Number(fine.amount || 0), 0);

  const overdueBooks = fines.filter(
    (fine) => fine.status === "unpaid" && fine.overdueDays > 0,
  ).length;

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="fines-page">
      <Navbar />

      <main className="fines-main">
        <div className="fines-container">
          {/* =================================================
              HEADER
          ================================================= */}

          <section className="fines-header">
            <div>
              <span className="fines-label">LIBRARY FINES</span>

              <h1>
                Your
                <em> Fines.</em>
              </h1>

              <p>Track overdue books and keep an eye on your library fines.</p>
            </div>

            <div className="fines-header-icon">
              <IndianRupee size={30} />
            </div>
          </section>

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <section className="fines-summary">
            {/* Total */}

            <div className="fine-summary-card">
              <div className="fine-summary-icon">
                <IndianRupee size={18} />
              </div>

              <div>
                <span>TOTAL FINE</span>

                <strong>₹{totalFine}</strong>
              </div>
            </div>

            {/* Outstanding */}

            <div className="fine-summary-card fine-summary-danger">
              <div className="fine-summary-icon">
                <AlertCircle size={18} />
              </div>

              <div>
                <span>OUTSTANDING</span>

                <strong>₹{unpaidFine}</strong>
              </div>
            </div>

            {/* Paid */}

            <div className="fine-summary-card fine-summary-success">
              <div className="fine-summary-icon">
                <CheckCircle2 size={18} />
              </div>

              <div>
                <span>PAID</span>

                <strong>₹{paidFine}</strong>
              </div>
            </div>

            {/* Overdue */}

            <div className="fine-summary-card fine-summary-warning">
              <div className="fine-summary-icon">
                <Clock3 size={18} />
              </div>

              <div>
                <span>OVERDUE BOOKS</span>

                <strong>{overdueBooks}</strong>
              </div>
            </div>
          </section>

          {/* =================================================
              FINE RULE
          ================================================= */}

          <div className="fine-rule">
            <div>
              <Clock3 size={17} />

              <span>Current fine rate</span>
            </div>

            <strong>₹{FINE_PER_DAY} / overdue day</strong>
          </div>

          {/* =================================================
              CONTROLS
          ================================================= */}

          <section className="fines-controls">
            <div className="fine-search">
              <Search size={16} />

              <input
                type="text"
                placeholder="Search by book or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="fine-filter">
              <Filter size={15} />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Fines</option>

                <option value="unpaid">Unpaid</option>

                <option value="paid">Paid</option>

                <option value="clear">No Fine</option>
              </select>
            </div>
          </section>

          {/* =================================================
              FINE LIST
          ================================================= */}

          <section className="fines-list">
            <div className="fines-list-header">
              <div>
                <span>FINE HISTORY</span>

                <h2>Library Records</h2>
              </div>

              <span className="fine-count">{filteredFines.length} records</span>
            </div>

            {filteredFines.length === 0 ? (
              <div className="fines-empty">
                <BookOpen size={28} />

                <h3>No fine records found</h3>

                <p>Try changing your search or filter.</p>
              </div>
            ) : (
              <div className="fine-table-wrapper">
                <table className="fine-table">
                  <thead>
                    <tr>
                      <th>BOOK</th>
                      <th>DUE DATE</th>
                      <th>OVERDUE</th>
                      <th>FINE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredFines.map((fine) => (
                      <tr key={fine.id}>
                        <td>
                          <div className="fine-book">
                            <div className="fine-book-icon">
                              <BookOpen size={16} />
                            </div>

                            <div>
                              <strong>{fine.bookTitle}</strong>

                              <span>{fine.author}</span>
                            </div>
                          </div>
                        </td>

                        <td>{formatDate(fine.dueDate)}</td>

                        <td>
                          {fine.overdueDays > 0 ? (
                            <span className="overdue-days">
                              {fine.overdueDays} days
                            </span>
                          ) : (
                            <span className="not-overdue">On time</span>
                          )}
                        </td>

                        <td>
                          <strong className="fine-amount">
                            ₹{fine.amount}
                          </strong>
                        </td>

                        <td>
                          {fine.status === "paid" ? (
                            <span className="fine-status fine-status-paid">
                              <CheckCircle2 size={13} />
                              Paid
                            </span>
                          ) : fine.status === "unpaid" ? (
                            <span className="fine-status fine-status-unpaid">
                              <AlertCircle size={13} />
                              Unpaid
                            </span>
                          ) : (
                            <span className="fine-status fine-status-clear">
                              Clear
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Fines;
