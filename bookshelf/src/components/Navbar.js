import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">📚</span>
          <span className="brand-name">BookShelf</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/catalog" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={() => setMenuOpen(false)}>
            Catalog
          </NavLink>
          {user && (
            <>
              <NavLink to="/my-books" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={() => setMenuOpen(false)}>
                My Books
              </NavLink>
              <NavLink to="/add-book" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={() => setMenuOpen(false)}>
                + Add Book
              </NavLink>
            </>
          )}
        </div>

        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <NavLink to="/profile" className="user-avatar" title={user.name}>
                {user.avatar || user.name[0]}
              </NavLink>
              <button className="btn btn-outline" onClick={handleLogout} style={{ fontSize: '13px', padding: '7px 14px' }}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-outline" style={{ fontSize: '13px', padding: '7px 14px' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: '13px', padding: '7px 14px' }}>
                Register
              </Link>
            </div>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}
