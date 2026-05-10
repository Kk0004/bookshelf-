import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBook } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookForm from '../components/BookForm';
import './BookFormPage.css';

export default function AddBook() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    try {
      const book = await createBook({ ...formData, ownerId: user.id });
      navigate(`/book/${book.id}`);
    } catch {
      setError('Failed to add the book. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="book-form-page">
      <div className="container">
        <div className="form-page-header">
          <h1>Add a New Book</h1>
          <p>Share a book with the BookShelf community</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="card form-card">
          <BookForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}
