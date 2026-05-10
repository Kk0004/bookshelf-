import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/api';
import { useBooks } from '../hooks/useBooks';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { books } = useBooks({ ownerId: user?.id });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name cannot be empty.'); return; }
    setSaving(true);
    setError('');
    try {
      const avatar = form.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      const updated = await updateUserProfile(user.id, { name: form.name.trim(), email: form.email, avatar });
      updateUser(updated);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1>My Profile</h1>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="profile-layout">
          {/* Profile card */}
          <div className="card profile-card">
            <div className="profile-avatar-lg">{user?.avatar || user?.name?.[0]}</div>
            <h2>{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
            <p className="profile-since">Member since {user?.createdAt}</p>

            <div className="profile-stats">
              <div className="p-stat">
                <strong>{books.length}</strong>
                <span>Books Added</span>
              </div>
            </div>

            {!editing ? (
              <button className="btn btn-outline" onClick={() => setEditing(true)} style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}>
                ✏️ Edit Profile
              </button>
            ) : (
              <form onSubmit={handleSave} style={{ marginTop: '20px', textAlign: 'left' }}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Recent books */}
          <div className="profile-books">
            <h3>Recently Added Books</h3>
            {books.length === 0 ? (
              <p className="profile-empty">You haven't added any books yet.</p>
            ) : (
              <div className="profile-book-list">
                {books.slice(0, 6).map(book => (
                  <div key={book.id} className="card profile-book-item">
                    <img
                      src={book.cover || `https://via.placeholder.com/60x80/6366f1/fff?text=${book.title.slice(0,2)}`}
                      alt={book.title}
                      className="profile-book-thumb"
                      onError={e => { e.target.src = `https://via.placeholder.com/60x80/6366f1/fff?text=${book.title.slice(0,2)}`; }}
                    />
                    <div className="profile-book-meta">
                      <strong>{book.title}</strong>
                      <span>{book.author}</span>
                      <span className="badge badge-genre">{book.genre}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
