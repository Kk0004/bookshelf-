import React, { useState } from 'react';
import './BookForm.css';

const GENRES = ['Classic', 'Fiction', 'Non-Fiction', 'Fantasy', 'Sci-Fi', 'Mystery', 'Thriller', 'Romance', 'Biography', 'History', 'Science', 'Self-Help', 'Dystopia', 'Horror', 'Adventure'];

export default function BookForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    author: initial.author || '',
    genre: initial.genre || '',
    year: initial.year || new Date().getFullYear(),
    description: initial.description || '',
    cover: initial.cover || '',
    rating: initial.rating || 0,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.author.trim()) e.author = 'Author is required.';
    if (!form.genre) e.genre = 'Please select a genre.';
    if (!form.year || form.year < 1000 || form.year > new Date().getFullYear() + 1) e.year = 'Enter a valid year.';
    if (!form.description.trim()) e.description = 'Description is required.';
    return e;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    onSubmit(form);
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => handleChange('title', e.target.value)}
            placeholder="Book title"
          />
          {errors.title && <span className="error-msg">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label>Author *</label>
          <input
            type="text"
            value={form.author}
            onChange={e => handleChange('author', e.target.value)}
            placeholder="Author name"
          />
          {errors.author && <span className="error-msg">{errors.author}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Genre *</label>
          <select value={form.genre} onChange={e => handleChange('genre', e.target.value)}>
            <option value="">Select genre</option>
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          {errors.genre && <span className="error-msg">{errors.genre}</span>}
        </div>
        <div className="form-group">
          <label>Year *</label>
          <input
            type="number"
            value={form.year}
            onChange={e => handleChange('year', parseInt(e.target.value))}
            min="1000"
            max={new Date().getFullYear() + 1}
            placeholder="Publication year"
          />
          {errors.year && <span className="error-msg">{errors.year}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Cover URL</label>
        <input
          type="url"
          value={form.cover}
          onChange={e => handleChange('cover', e.target.value)}
          placeholder="https://covers.openlibrary.org/..."
        />
        {form.cover && (
          <div className="cover-preview">
            <img src={form.cover} alt="Cover preview"
              onError={e => e.target.style.display = 'none'} />
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea
          value={form.description}
          onChange={e => handleChange('description', e.target.value)}
          placeholder="Write a brief description of the book..."
          rows={4}
        />
        {errors.description && <span className="error-msg">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label>Your Rating</label>
        <div className="rating-row">
          {[1,2,3,4,5].map(s => (
            <span
              key={s}
              className={`form-star ${s <= form.rating ? 'filled' : ''}`}
              onClick={() => handleChange('rating', s)}
            >★</span>
          ))}
          {form.rating > 0 && (
            <button type="button" className="rating-clear" onClick={() => handleChange('rating', 0)}>
              Clear
            </button>
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
        {loading ? 'Saving...' : (initial.id ? 'Update Book' : 'Add Book')}
      </button>
    </form>
  );
}
