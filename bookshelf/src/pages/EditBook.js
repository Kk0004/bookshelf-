import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, updateBook } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookForm from '../components/BookForm';
import './BookFormPage.css';

export default function EditBook() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const b = await getBookById(id);
        if (b.ownerId !== user?.id) {
          navigate('/');
          return;
        }
        setBook(b);
      } catch {
        setError('Book not found.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user, navigate]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError('');
    try {
      await updateBook(id, { ...book, ...formData });
      navigate(`/book/${id}`);
    } catch {
      setError('Failed to update the book.');
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (error && !book) return <div className="container" style={{ padding: '64px 24px' }}><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="book-form-page">
      <div className="container">
        <div className="form-page-header">
          <h1>Edit Book</h1>
          <p>Update the details for "{book?.title}"</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="card form-card">
          <BookForm initial={book} onSubmit={handleSubmit} loading={saving} />
        </div>
      </div>
    </div>
  );
}
