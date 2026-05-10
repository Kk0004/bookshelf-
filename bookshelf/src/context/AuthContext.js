import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const stored = localStorage.getItem('bookshelf_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`/users?email=${email}&password=${password}`);
    const users = await res.json();
    if (users.length === 0) {
      throw new Error('Invalid email or password.');
    }
    const loggedIn = users[0];
    setUser(loggedIn);
    localStorage.setItem('bookshelf_user', JSON.stringify(loggedIn));
    return loggedIn;
  };

  const register = async (name, email, password) => {
    // Check if email already exists
    const checkRes = await fetch(`/users?email=${email}`);
    const existing = await checkRes.json();
    if (existing.length > 0) {
      throw new Error('An account with this email already exists.');
    }
    const avatar = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const newUser = {
      name,
      email,
      password,
      avatar,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const res = await fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    const created = await res.json();
    setUser(created);
    localStorage.setItem('bookshelf_user', JSON.stringify(created));
    return created;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookshelf_user');
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('bookshelf_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
