const BASE = '';

export async function getBooks(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`/books${query ? '?' + query : ''}`);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function getBookById(id) {
  const res = await fetch(`/books/${id}`);
  if (!res.ok) throw new Error('Book not found');
  return res.json();
}

export async function createBook(bookData) {
  const res = await fetch('/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...bookData, createdAt: new Date().toISOString().split('T')[0] }),
  });
  if (!res.ok) throw new Error('Failed to create book');
  return res.json();
}

export async function updateBook(id, bookData) {
  const res = await fetch(`/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });
  if (!res.ok) throw new Error('Failed to update book');
  return res.json();
}

export async function deleteBook(id) {
  const res = await fetch(`/books/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete book');
  return true;
}

export async function getReviewsByBook(bookId) {
  const res = await fetch(`/reviews?bookId=${bookId}`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function createReview(reviewData) {
  const res = await fetch('/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...reviewData, createdAt: new Date().toISOString().split('T')[0] }),
  });
  if (!res.ok) throw new Error('Failed to create review');
  return res.json();
}

export async function deleteReview(id) {
  const res = await fetch(`/reviews/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete review');
  return true;
}

export async function updateUserProfile(id, data) {
  const res = await fetch(`/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}
