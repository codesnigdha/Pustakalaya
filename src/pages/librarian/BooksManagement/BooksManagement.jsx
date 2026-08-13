import { BookOpen, Edit3, Plus, Search, Trash2 } from "lucide-react";

import { useState } from "react";

import "./BooksManagement.css";

function BooksManagement() {
  const [search, setSearch] = useState("");

  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Alchemist",
      author: "Paulo Coelho",
      category: "Fiction",
      quantity: 12,
      available: 8,
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      category: "Self Help",
      quantity: 10,
      available: 6,
    },
    {
      id: 3,
      title: "Clean Code",
      author: "Robert C. Martin",
      category: "Programming",
      quantity: 8,
      available: 3,
    },
    {
      id: 4,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      category: "Fiction",
      quantity: 6,
      available: 4,
    },
  ]);

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author} ${book.category}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const deleteBook = (id) => {
    setBooks((previous) => previous.filter((book) => book.id !== id));
  };

  return (
    <div className="lib-books-page">
      <div className="lib-page-header">
        <div>
          <span>LIBRARY CATALOGUE</span>

          <h1>
            Books <em>Management</em>
          </h1>

          <p>Add, edit and manage books in the library.</p>
        </div>

        <button className="lib-primary-btn">
          <Plus size={16} />
          Add Book
        </button>
      </div>

      <div className="lib-books-toolbar">
        <div className="lib-search-box">
          <Search size={16} />

          <input
            type="text"
            placeholder="Search books, authors or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span className="lib-book-count">{filteredBooks.length} books</span>
      </div>

      <div className="lib-books-table-wrapper">
        <table className="lib-books-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Author</th>
              <th>Category</th>
              <th>Total</th>
              <th>Available</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td>
                  <div className="lib-book-name">
                    <div>
                      <BookOpen size={16} />
                    </div>

                    <strong>{book.title}</strong>
                  </div>
                </td>

                <td>{book.author}</td>

                <td>
                  <span className="lib-category">{book.category}</span>
                </td>

                <td>{book.quantity}</td>

                <td>{book.available}</td>

                <td>
                  <span
                    className={
                      book.available > 0
                        ? "lib-status available"
                        : "lib-status unavailable"
                    }
                  >
                    {book.available > 0 ? "Available" : "Unavailable"}
                  </span>
                </td>

                <td>
                  <div className="lib-table-actions">
                    <button title="Edit">
                      <Edit3 size={15} />
                    </button>

                    <button title="Delete" onClick={() => deleteBook(book.id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BooksManagement;
