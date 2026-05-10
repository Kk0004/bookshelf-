import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBookById, getReviewsByBook, createReview, deleteReview, deleteBook } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import './BookDetail.css';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [b, r] = await Promise.all([getBookById(id), getReviewsByBook(id)]);
        setBook(b);
        setReviews(r);
      } catch {
        setError('Book not found.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const isOwner = user && book && user.id === book.ownerId;
  const alreadyReviewed = reviews.some(r => r.userId === user?.id);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) { setReviewError('Please select a rating.'); return; }
    if (!reviewForm.comment.trim()) { setReviewError('Please write a comment.'); return; }
    setSubmitting(true);
    try {
      const newReview = await createReview({
        bookId: id,
        userId: user.id,
        userName: user.name,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviews(prev => [newReview, ...prev]);
      setReviewForm({ rating: 0, comment: '' });
      setReviewError('');
    } catch {
      setReviewError('Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    await deleteReview(reviewId);
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const handleDeleteBook = async () => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    setDeleting(true);
    await deleteBook(id);
    navigate('/my-books');
  };

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (error) return (
    <div className="container" style={{ padding: '64px 24px' }}>
      <div className="alert alert-error">{error}</div>
      <Link to="/catalog" className="btn btn-outline">Back to Catalog</Link>
    </div>
  );

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : book.rating;

  return (
    <div className="book-detail-page">
      <div className="container">
        {/* Back */}
        <Link to="/catalog" className="back-link">← Back to Catalog</Link>

        {/* Book header */}
        <div className="book-detail-header">
          <div className="book-detail-cover">
            <img
              src={book.cover || `https://via.placeholder.com/300x420?text=${encodeURIComponent(book.title)}`}
              alt={book.title}
              onError={e => { e.target.src = `https://via.placeholder.com/300x420/6366f1/fff?text=${encodeURIComponent(book.title.slice(0,2))}`; }}
            />
          </div>
          <div className="book-detail-info">
            <span className="badge badge-genre">{book.genre}</span>
            <h1>{book.title}</h1>
            <p className="detail-author">by <strong>{book.author}</strong></p>
            <div className="detail-rating">
              <StarRating rating={Number(avgRating)} readonly size="md" />
              <span className="review-count">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
            </div>
            <p className="detail-year">Published: {book.year}</p>
            <p className="detail-description">{book.description}</p>

            {isOwner && (
              <div className="owner-actions">
                <Link to={`/edit-book/${book.id}`} className="btn btn-outline">✏️ Edit</Link>
                <button className="btn btn-danger" onClick={handleDeleteBook} disabled={deleting}>
                  {deleting ? 'Deleting...' : '🗑 Delete'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews section */}
        <div className="reviews-section">
          <h2>Reviews ({reviews.length})</h2>

          {/* Add review form */}
          {user && !alreadyReviewed && (
            <form className="review-form card" onSubmit={handleReviewSubmit}>
              <h3>Write a Review</h3>
              <div className="form-group">
                <label>Rating</label>
                <StarRating
                  rating={reviewForm.rating}
                  onChange={r => setReviewForm(prev => ({ ...prev, rating: r }))}
                  size="lg"
                />
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your thoughts about this book..."
                  rows={3}
                />
              </div>
              {reviewError && <div className="alert alert-error">{reviewError}</div>}
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {!user && (
            <div className="login-prompt">
              <Link to="/login">Login</Link> to leave a review.
            </div>
          )}

          {alreadyReviewed && (
            <div className="alert alert-success">You have already reviewed this book.</div>
          )}

          {/* Reviews list */}
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first!</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="review-card card">
                  <div className="review-header">
                    <div className="reviewer-avatar">{review.userName[0]}</div>
                    <div>
                      <strong>{review.userName}</strong>
                      <StarRating rating={review.rating} readonly size="sm" />
                    </div>
                    <span className="review-date">{review.createdAt}</span>
                    {(user?.id === review.userId) && (
                      <button
                        className="delete-review-btn"
                        onClick={() => handleDeleteReview(review.id)}
                        title="Delete review"
                      >×</button>
                    )}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
