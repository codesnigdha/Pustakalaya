import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Hash,
  Image,
  Library,
  LoaderCircle,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
  AlertTriangle,
  Save,
  RefreshCw,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../../../services/bookService";

import "./BooksManagement.css";

const EMPTY_BOOK = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  publisher: "",
  publicationYear: "",
  totalCopies: 1,
  availableCopies: 1,
  coverImage: "",
  description: "",
};

const CATEGORIES = [
  {
    id: 1,
    name: "Programming",
  },
  {
    id: 2,
    name: "Database",
  },
  {
    id: 3,
    name: "Networking",
  },
  {
    id: 4,
    name: "Operating Systems",
  },
  {
    id: 5,
    name: "Artificial Intelligence",
  },
  {
    id: 6,
    name: "Web Development",
  },
];

function getCategoryName(book) {
  if (book?.category && typeof book.category === "object") {
    return book.category.name || "Other";
  }

  return book?.category || "Other";
}

function getCategoryId(book) {
  return book?.category?.id ?? null;
}

function getAvailableCopies(book) {
  return Number(book?.availableCopies ?? 0);
}

function getTotalCopies(book) {
  return Number(book?.totalCopies ?? 0);
}

function BooksManagement() {
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");

  const [availabilityFilter, setAvailabilityFilter] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingBook, setEditingBook] = useState(null);

  const [formData, setFormData] = useState({
    ...EMPTY_BOOK,
  });

  const [formLoading, setFormLoading] = useState(false);

  const [formError, setFormError] = useState("");

  const [deleteBookData, setDeleteBookData] = useState(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  /* =========================
     LOAD BOOKS
  ========================= */

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllBooks();

      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(err.message || "Unable to load books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  /* =========================
     CLEAR MESSAGES
  ========================= */

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  /* =========================
     FILTER
  ========================= */

  const filteredBooks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        !keyword ||
        String(book.title || "")
          .toLowerCase()
          .includes(keyword) ||
        String(book.author || "")
          .toLowerCase()
          .includes(keyword) ||
        String(book.isbn || "")
          .toLowerCase()
          .includes(keyword);

      const matchesCategory =
        !categoryFilter || getCategoryName(book) === categoryFilter;

      const available = getAvailableCopies(book) > 0;

      const matchesAvailability =
        !availabilityFilter ||
        (availabilityFilter === "available" ? available : !available);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [books, search, categoryFilter, availabilityFilter]);

  /* =========================
     ADD BOOK
  ========================= */

  const handleAddBook = () => {
    clearMessages();

    setEditingBook(null);

    setFormData({
      ...EMPTY_BOOK,
    });

    setFormError("");

    setShowForm(true);
  };

  /* =========================
     EDIT BOOK
  ========================= */

  const handleEditBook = (book) => {
    clearMessages();

    setEditingBook(book);

    setFormData({
      title: book.title || "",

      author: book.author || "",

      isbn: book.isbn || "",

      category: getCategoryId(book) ? String(getCategoryId(book)) : "",

      publisher: book.publisher || "",

      publicationYear: book.publicationYear ?? "",

      totalCopies: book.totalCopies ?? 1,

      availableCopies: book.availableCopies ?? 0,

      coverImage: book.coverImage || "",

      description: book.description || "",
    });

    setFormError("");

    setShowForm(true);
  };

  /* =========================
     CLOSE FORM
  ========================= */

  const closeForm = () => {
    if (formLoading) {
      return;
    }

    setShowForm(false);

    setEditingBook(null);

    setFormError("");

    setFormData({
      ...EMPTY_BOOK,
    });
  };

  /* =========================
     INPUT
  ========================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  /* =========================
     VALIDATION
  ========================= */

  const validateForm = () => {
    if (!formData.title.trim()) {
      return "Book title is required.";
    }

    if (!formData.author.trim()) {
      return "Author name is required.";
    }

    if (!formData.category) {
      return "Please select a category.";
    }

    const total = Number(formData.totalCopies);

    const available = Number(formData.availableCopies);

    if (!Number.isInteger(total) || total < 1) {
      return "Total copies must be at least 1.";
    }

    if (!Number.isInteger(available) || available < 0) {
      return "Available copies cannot be negative.";
    }

    if (available > total) {
      return "Available copies cannot be greater than total copies.";
    }

    if (
      formData.publicationYear &&
      (Number(formData.publicationYear) < 1000 ||
        Number(formData.publicationYear) > 9999)
    ) {
      return "Please enter a valid publication year.";
    }

    return "";
  };

  /* =========================
     PAYLOAD
  ========================= */

  const prepareBookData = () => ({
    title: formData.title.trim(),

    author: formData.author.trim(),

    isbn: formData.isbn.trim() || null,

    category: {
      id: Number(formData.category),
    },

    publisher: formData.publisher.trim() || null,

    publicationYear: formData.publicationYear
      ? Number(formData.publicationYear)
      : null,

    totalCopies: Number(formData.totalCopies),

    availableCopies: Number(formData.availableCopies),

    coverImage: formData.coverImage.trim() || null,

    description: formData.description.trim() || null,
  });

  /* =========================
     SAVE BOOK
  ========================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    clearMessages();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);

      return;
    }

    try {
      setFormLoading(true);

      const payload = prepareBookData();

      if (editingBook) {
        await updateBook(editingBook.id, payload);

        setSuccess("Book updated successfully.");
      } else {
        await addBook(payload);

        setSuccess("Book added successfully.");
      }

      closeForm();

      await loadBooks();
    } catch (err) {
      console.error(err);

      setFormError(err.message || "Unable to save book.");
    } finally {
      setFormLoading(false);
    }
  };

  /* =========================
     DELETE
  ========================= */

  const handleDeleteConfirm = async () => {
    if (!deleteBookData) {
      return;
    }

    try {
      setDeleteLoading(true);

      clearMessages();

      await deleteBook(deleteBookData.id);

      setSuccess("Book deleted successfully.");

      setDeleteBookData(null);

      await loadBooks();
    } catch (err) {
      console.error(err);

      setError(err.message || "Unable to delete book.");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* =========================
     STATISTICS
  ========================= */

  const totalBooks = books.length;

  const availableBooks = books.filter(
    (book) => getAvailableCopies(book) > 0,
  ).length;

  const unavailableBooks = totalBooks - availableBooks;

  /* =========================
     UI
  ========================= */

  return (
    <div className="books-management-page">
      {/* HEADER */}

      <div className="books-management-header">
        <div>
          <span className="books-management-eyebrow">LIBRARY CATALOGUE</span>

          <h1>Books Management</h1>

          <p>Add, update, view and manage books in the Pustakalaya library.</p>
        </div>

        <button
          type="button"
          className="books-add-button"
          onClick={handleAddBook}
        >
          <Plus size={17} />
          Add New Book
        </button>
      </div>

      {/* SUCCESS */}

      {success && (
        <div className="books-management-alert success">
          <CheckCircle2 size={17} />

          <span>{success}</span>

          <button type="button" onClick={() => setSuccess("")}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="books-management-alert error">
          <AlertTriangle size={17} />

          <span>{error}</span>

          <button type="button" onClick={() => setError("")}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* STATS */}

      <div className="books-management-stats">
        <div className="book-stat-card">
          <div className="book-stat-icon">
            <Library size={19} />
          </div>

          <div>
            <span>Total Books</span>

            <strong>{totalBooks}</strong>
          </div>
        </div>

        <div className="book-stat-card">
          <div className="book-stat-icon available">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <span>Available</span>

            <strong>{availableBooks}</strong>
          </div>
        </div>

        <div className="book-stat-card">
          <div className="book-stat-icon unavailable">
            <BookOpen size={19} />
          </div>

          <div>
            <span>Unavailable</span>

            <strong>{unavailableBooks}</strong>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}

      <div className="books-management-toolbar">
        <div className="books-search">
          <Search size={17} />

          <input
            type="search"
            placeholder="Search by title, author or ISBN..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {search && (
            <button type="button" onClick={() => setSearch("")}>
              <X size={15} />
            </button>
          )}
        </div>

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="books-filter-select"
        >
          <option value="">All Categories</option>

          {CATEGORIES.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={availabilityFilter}
          onChange={(event) => setAvailabilityFilter(event.target.value)}
          className="books-filter-select"
        >
          <option value="">All Availability</option>

          <option value="available">Available</option>

          <option value="unavailable">Unavailable</option>
        </select>

        <button
          type="button"
          className="books-refresh-button"
          onClick={loadBooks}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "refresh-spinning" : ""} />
        </button>
      </div>

      {/* RESULT COUNT */}

      {!loading && (
        <div className="books-result-count">
          Showing <strong>{filteredBooks.length}</strong> of{" "}
          <strong>{books.length}</strong> books
        </div>
      )}

      {/* LOADING */}

      {loading ? (
        <div className="books-management-state">
          <LoaderCircle size={38} className="books-loading-spinner" />

          <h2>Loading Books</h2>

          <p>Getting the latest catalogue from the library server.</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        /* EMPTY */

        <div className="books-management-empty">
          <div className="books-empty-icon">
            <BookOpen size={35} />
          </div>

          <h2>No Books Found</h2>

          <p>
            {books.length === 0
              ? "There are no books in the catalogue yet."
              : "No books match your current search or filters."}
          </p>

          {books.length === 0 ? (
            <button
              type="button"
              className="books-empty-add"
              onClick={handleAddBook}
            >
              <Plus size={16} />
              Add First Book
            </button>
          ) : (
            <button
              type="button"
              className="books-empty-clear"
              onClick={() => {
                setSearch("");
                setCategoryFilter("");
                setAvailabilityFilter("");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        /* TABLE */

        <div className="books-table-wrapper">
          <table className="books-management-table">
            <thead>
              <tr>
                <th>Book</th>

                <th>Category</th>

                <th>ISBN</th>

                <th>Copies</th>

                <th>Status</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBooks.map((book) => {
                const available = getAvailableCopies(book);

                const total = getTotalCopies(book);

                const isAvailable = available > 0;

                return (
                  <tr key={book.id}>
                    <td>
                      <div className="management-book-cell">
                        <div className="management-book-cover">
                          {book.coverImage ? (
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <BookOpen size={19} />
                          )}
                        </div>

                        <div className="management-book-info">
                          <strong>{book.title}</strong>

                          <span>
                            <UserRound size={11} />

                            {book.author || "Unknown Author"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="book-category-badge">
                        {getCategoryName(book)}
                      </span>
                    </td>

                    <td>
                      <span className="book-isbn">{book.isbn || "—"}</span>
                    </td>

                    <td>
                      <div className="book-copies">
                        <strong>{available}</strong>

                        <span>/ {total}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`book-status ${
                          isAvailable ? "available" : "unavailable"
                        }`}
                      >
                        {isAvailable ? (
                          <CheckCircle2 size={13} />
                        ) : (
                          <X size={13} />
                        )}

                        {isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>

                    <td>
                      <div className="book-table-actions">
                        <button
                          type="button"
                          className="book-edit-action"
                          onClick={() => handleEditBook(book)}
                          title="Edit book"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          type="button"
                          className="book-delete-action"
                          onClick={() => setDeleteBookData(book)}
                          title="Delete book"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD / EDIT MODAL */}

      {showForm && (
        <div className="books-modal-overlay" onClick={closeForm}>
          <div
            className="books-form-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="books-modal-header">
              <div>
                <span>
                  {editingBook ? "UPDATE CATALOGUE" : "NEW CATALOGUE ENTRY"}
                </span>

                <h2>{editingBook ? "Edit Book" : "Add New Book"}</h2>
              </div>

              <button
                type="button"
                className="books-modal-close"
                onClick={closeForm}
              >
                <X size={18} />
              </button>
            </div>

            {/* FORM ERROR */}

            {formError && (
              <div className="books-form-error">
                <AlertTriangle size={16} />

                {formError}
              </div>
            )}

            <form className="books-management-form" onSubmit={handleSubmit}>
              {/* TITLE */}

              <div className="books-form-field full">
                <label>Book Title *</label>

                <div className="books-form-input">
                  <BookOpen size={16} />

                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter book title"
                    disabled={formLoading}
                  />
                </div>
              </div>

              {/* AUTHOR */}

              <div className="books-form-field">
                <label>Author *</label>

                <div className="books-form-input">
                  <UserRound size={16} />

                  <input
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Author name"
                    disabled={formLoading}
                  />
                </div>
              </div>

              {/* ISBN */}

              <div className="books-form-field">
                <label>ISBN</label>

                <div className="books-form-input">
                  <Hash size={16} />

                  <input
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    placeholder="ISBN number"
                    disabled={formLoading}
                  />
                </div>
              </div>

              {/* CATEGORY */}

              <div className="books-form-field">
                <label>Category *</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={formLoading}
                >
                  <option value="">Select category</option>

                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PUBLISHER */}

              <div className="books-form-field">
                <label>Publisher</label>

                <div className="books-form-input">
                  <Library size={16} />

                  <input
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                    placeholder="Publisher"
                    disabled={formLoading}
                  />
                </div>
              </div>

              {/* YEAR */}

              <div className="books-form-field">
                <label>Publication Year</label>

                <div className="books-form-input">
                  <CalendarDays size={16} />

                  <input
                    type="number"
                    name="publicationYear"
                    value={formData.publicationYear}
                    onChange={handleChange}
                    min="1000"
                    max="9999"
                    placeholder="e.g. 2024"
                    disabled={formLoading}
                  />
                </div>
              </div>

              {/* TOTAL */}

              <div className="books-form-field">
                <label>Total Copies *</label>

                <div className="books-form-input">
                  <Library size={16} />

                  <input
                    type="number"
                    name="totalCopies"
                    value={formData.totalCopies}
                    onChange={handleChange}
                    min="1"
                    disabled={formLoading}
                  />
                </div>
              </div>

              {/* AVAILABLE */}

              <div className="books-form-field">
                <label>Available Copies *</label>

                <div className="books-form-input">
                  <CheckCircle2 size={16} />

                  <input
                    type="number"
                    name="availableCopies"
                    value={formData.availableCopies}
                    onChange={handleChange}
                    min="0"
                    max={formData.totalCopies || undefined}
                    disabled={formLoading}
                  />
                </div>
              </div>

              {/* COVER */}

              <div className="books-form-field full">
                <label>Cover Image URL</label>

                <div className="books-form-input">
                  <Image size={16} />

                  <input
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    placeholder="https://example.com/book-cover.jpg"
                    disabled={formLoading}
                  />
                </div>
              </div>

              {/* DESCRIPTION */}

              <div className="books-form-field full">
                <label>Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter a short description..."
                  rows="5"
                  disabled={formLoading}
                />
              </div>

              {/* BUTTONS */}

              <div className="books-form-actions">
                <button
                  type="button"
                  className="books-cancel-button"
                  onClick={closeForm}
                  disabled={formLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="books-save-button"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <LoaderCircle size={16} className="books-loading-spinner" />
                  ) : editingBook ? (
                    <Save size={16} />
                  ) : (
                    <Plus size={16} />
                  )}

                  {formLoading
                    ? "Saving..."
                    : editingBook
                      ? "Update Book"
                      : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}

      {deleteBookData && (
        <div
          className="books-modal-overlay"
          onClick={() => !deleteLoading && setDeleteBookData(null)}
        >
          <div
            className="books-delete-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="books-delete-icon">
              <Trash2 size={24} />
            </div>

            <h2>Delete Book?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>"{deleteBookData.title}"</strong>?
            </p>

            <div className="books-delete-actions">
              <button
                type="button"
                className="books-delete-cancel"
                onClick={() => setDeleteBookData(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="books-delete-confirm"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <LoaderCircle size={16} className="books-loading-spinner" />
                ) : (
                  <Trash2 size={16} />
                )}

                {deleteLoading ? "Deleting..." : "Delete Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BooksManagement;
