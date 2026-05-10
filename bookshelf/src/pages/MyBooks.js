import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../hooks/useBooks';
import { deleteBook } from '../services/api';
import BookCard from '../components/BookCard';
import './MyBooks.css';

export default function MyBooks() {
  const { user } = useAuth();
  const { books, loading, error, refetch } = useBooks({ ownerId: user?.id });

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm('Delete this book?')) return;
    await deleteBook(id);
    refetch();
  };

  return (
    <div className="my-books-page">
      <div className="container">
        <div className="my-books-header">
          <div>
            <h1>My Books</h1>
            <p>{books.length} {books.length === 1 ? 'book' : 'books'} added</p>
          </div>
          <Link to="/add-book" className="btn btn-primary">+ Add Book</Link>
        </div>

        {loading ? (
          <div className="page-loading"><div className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : books.length === 0 ? (
          <div className="empty-my-books">
            <div className="empty-icon">📖</div>
            <h3>Your shelf is empty</h3>
            <p>Start by adding your first book to your collection.</p>
            <Link to="/add-book" className="btn btn-primary" style={{ marginTop: '16px' }}>
              + Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="my-books-grid">
            {books.map(book => (
              <div key={book.id} className="my-book-wrapper">
                <BookCard book={book} />
                <div className="my-book-actions">
                  <Link to={`/edit-book/${book.id}`} className="btn btn-outline action-btn">✏️ Edit</Link>
                  <button className="btn btn-danger action-btn" onClick={e => handleDelete(e, book.id)}>🗑 Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
