import React from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const GENRES = ['Classic', 'Fiction', 'Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Dystopia'];

export default function Home() {
  const { books, loading } = useBooks();
  const { user } = useAuth();

  const featured = books.slice(0, 3);
  const topRated = [...books].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <h1>Your personal<br /><span className="hero-accent">digital bookshelf</span></h1>
            <p className="hero-sub">
              Discover, track, and share the books you love.
              Build your reading list and connect with great stories.
            </p>
            <div className="hero-actions">
              <Link to="/catalog" className="btn btn-primary">Browse Catalog</Link>
              {!user && (
                <Link to="/register" className="btn btn-outline">Create Account</Link>
              )}
              {user && (
                <Link to="/add-book" className="btn btn-outline">+ Add a Book</Link>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="book-stack">
              {['📗', '📘', '📕', '📙'].map((emoji, i) => (
                <div key={i} className="stack-book" style={{ '--i': i }}>{emoji}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="container stats-inner">
          <div className="stat">
            <strong>{books.length}</strong>
            <span>Books</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <strong>{GENRES.length}+</strong>
            <span>Genres</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <strong>Free</strong>
            <span>Always</span>
          </div>
        </div>
      </div>

      {/* Featured books */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Books</h2>
            <Link to="/catalog" className="see-all">See all →</Link>
          </div>
          {loading ? (
            <div className="page-loading"><div className="spinner" /></div>
          ) : (
            <div className="books-grid books-grid-3">
              {featured.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          )}
        </div>
      </section>

      {/* Genres */}
      <section className="section genres-section">
        <div className="container">
          <h2>Browse by Genre</h2>
          <div className="genres-grid">
            {GENRES.map(genre => (
              <Link key={genre} to={`/catalog?genre=${genre}`} className="genre-chip">
                {genre}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top rated */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Top Rated</h2>
            <Link to="/catalog" className="see-all">See all →</Link>
          </div>
          {loading ? (
            <div className="page-loading"><div className="spinner" /></div>
          ) : (
            <div className="books-grid books-grid-4">
              {topRated.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta-section">
          <div className="container cta-inner">
            <h2>Ready to start reading?</h2>
            <p>Join BookShelf and build your personal library today.</p>
            <Link to="/register" className="btn btn-primary">Get Started — It's Free</Link>
          </div>
        </section>
      )}
    </div>
  );
}
