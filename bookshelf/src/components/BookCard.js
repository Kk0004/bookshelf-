import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import './BookCard.css';

export default function BookCard({ book }) {
  return (
    <Link to={`/book/${book.id}`} className="book-card">
      <div className="book-cover">
        <img
          src={book.cover || `https://via.placeholder.com/200x280?text=${encodeURIComponent(book.title)}`}
          alt={book.title}
          onError={e => { e.target.src = `https://via.placeholder.com/200x280/6366f1/fff?text=${encodeURIComponent(book.title.slice(0,2))}`; }}
        />
        <span className="badge badge-genre book-genre">{book.genre}</span>
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <div className="book-meta">
          <StarRating rating={book.rating} readonly size="sm" />
          <span className="book-year">{book.year}</span>
        </div>
      </div>
    </Link>
  );
}
