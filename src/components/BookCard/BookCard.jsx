import { BookOpen, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import "./BookCard.css";

function BookCard({ book }) {
  const [liked, setLiked] = useState(false);

  if (!book) return null;

  return (
    <article className="book-card">
      <div className="book-card-image">
        {book.image ? (
          <img src={book.image} alt={book.title} />
        ) : (
          <div className="book-card-placeholder">
            <BookOpen size={42} />
          </div>
        )}

        <button
          className={`book-card-wishlist ${liked ? "liked" : ""}`}
          onClick={() => setLiked(!liked)}
          aria-label="Add to wishlist"
        >
          <Heart size={17} fill={liked ? "currentColor" : "none"} />
        </button>

        {book.type && <span className="book-card-type">{book.type}</span>}
      </div>

      <div className="book-card-content">
        <div className="book-card-category">{book.category || "General"}</div>

        <h3>{book.title}</h3>

        <p className="book-card-author">{book.author || "Unknown Author"}</p>

        {book.rating && (
          <div className="book-card-rating">
            <Star size={14} fill="currentColor" />
            <span>{book.rating}</span>
          </div>
        )}

        <Link to={`/books/${book.id}`} className="book-card-btn">
          View Details
        </Link>
      </div>
    </article>
  );
}

export default BookCard;
