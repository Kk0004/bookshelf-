import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import './Catalog.css';

const GENRES = ['All', 'Classic', 'Fiction', 'Non-Fiction', 'Fantasy', 'Sci-Fi', 'Mystery', 'Thriller', 'Romance', 'Biography', 'History', 'Dystopia', 'Horror', 'Adventure'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'title', label: 'Title A–Z' },
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState(searchParams.get('genre') || 'All');
  const [sort, setSort] = useState('newest');

  const { books, loading, error } = useBooks();

  useEffect(() => {
    const g = searchParams.get('genre');
    if (g) setGenre(g);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...books];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q)
      );
    }

    if (genre && genre !== 'All') {
      result = result.filter(b => b.genre === genre);
    }

    switch (sort) {
      case 'oldest':
        result.sort((a, b) => a.year - b.year);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default: // newest
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [books, search, genre, sort]);

  const handleGenreChange = (g) => {
    setGenre(g);
    setSearchParams(g !== 'All' ? { genre: g } : {});
  };

  return (
    <div className="catalog-page">
      <div className="container">
        <div className="catalog-header">
          <h1>Book Catalog</h1>
          <p>{filtered.length} {filtered.length === 1 ? 'book' : 'books'} found</p>
        </div>

        {/* Search + Sort */}
        <div className="catalog-controls">
          <div className="search-wrap">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by title, author or genre..." />
          </div>
          <select
            className="sort-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Genre filter */}
        <div className="genre-filter">
          {GENRES.map(g => (
            <button
              key={g}
              className={`genre-btn ${genre === g ? 'active' : ''}`}
              onClick={() => handleGenreChange(g)}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="page-loading"><div className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No books found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="books-grid-catalog">
            {filtered.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        )}
      </div>
    </div>
  );
}
