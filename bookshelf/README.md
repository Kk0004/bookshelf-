# 📚 BookShelf — React Coursework Project

A full-featured book catalog web application built with React.

## Tech Stack
- **React 18** — Components, Hooks, Context API
- **React Router v6** — Routing & Protected Routes
- **JSON Server** — REST API / Mock Backend
- **CSS Modules** — Component-scoped styling

## Features

### Authentication
- Register with name, email, password (with validation)
- Login / Logout
- Persistent session via localStorage
- Protected routes (redirect to login if not authenticated)

### Books
- Browse all books in the catalog
- Search by title, author or genre
- Filter by genre
- Sort by newest, oldest, highest rated, title A–Z
- View book detail page
- Add a new book (authenticated users only)
- Edit/Delete own books (owner only)

### Reviews
- Leave a star rating + comment on any book
- One review per user per book
- Delete your own review

### Profile
- View your profile and stats
- Edit your name and email
- See your recently added books

### Navigation
- Sticky navbar with active links
- Mobile-responsive hamburger menu
- Dynamic nav items based on auth state

## Project Structure

```
bookshelf/
├── db.json                  # JSON Server database
├── package.json
├── public/
│   └── index.html
└── src/
    ├── App.js               # Router & route definitions
    ├── index.js             # Entry point
    ├── index.css            # Global styles + utilities
    ├── context/
    │   └── AuthContext.js   # Auth state & login/register/logout
    ├── hooks/
    │   └── useBooks.js      # Custom hook for fetching books
    ├── services/
    │   └── api.js           # All REST API calls
    ├── components/
    │   ├── Navbar.js/css
    │   ├── BookCard.js/css
    │   ├── BookForm.js/css
    │   ├── SearchBar.js/css
    │   ├── StarRating.js/css
    │   └── PrivateRoute.js
    └── pages/
        ├── Home.js/css
        ├── Catalog.js/css
        ├── BookDetail.js/css
        ├── Login.js
        ├── Register.js
        ├── AuthPages.css
        ├── AddBook.js
        ├── EditBook.js
        ├── BookFormPage.css
        ├── MyBooks.js/css
        ├── Profile.js/css
        └── NotFound.js/css
```

## Hooks Used
| Hook | Where | Purpose |
|------|-------|---------|
| `useState` | All forms & pages | Local component state |
| `useEffect` | BookDetail, EditBook, AuthContext | Data fetching & side effects |
| `useContext` | `useAuth()` throughout app | Global auth state |
| `useCallback` | `useBooks` hook | Memoize fetch function |
| `useMemo` | Catalog page | Filtered/sorted book list |
| `useNavigate` | Forms, Navbar | Programmatic navigation |
| `useParams` | BookDetail, EditBook | URL params |
| `useLocation` | Login, PrivateRoute | Redirect after login |
| `useSearchParams` | Catalog | Genre filter from URL |

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install json-server globally (optional)
npm install -g json-server
```

### Running the App

You need two terminals:

**Terminal 1 — Start the API server:**
```bash
npx json-server --watch db.json --port 3001
```

**Terminal 2 — Start the React app:**
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials
```
Email:    admin@bookshelf.com
Password: admin123
```

## GitHub Commit Strategy (for exam)

Suggested commits to show progressive development:

1. `init: create react app and project structure`
2. `feat: add json-server database and api service`
3. `feat: add AuthContext with login/register/logout`
4. `feat: add Navbar component with routing`
5. `feat: add Home page with hero section`
6. `feat: add Catalog page with search and filters`
7. `feat: add BookCard and BookDetail components`
8. `feat: add Add/Edit book forms with validation`
9. `feat: add reviews system on BookDetail`
10. `feat: add MyBooks page with CRUD actions`
11. `feat: add Profile page with edit functionality`
12. `feat: add PrivateRoute for authentication guard`
13. `feat: add responsive design and mobile navbar`
14. `fix: form validation and error handling`
15. `style: polish UI, transitions and typography`

## API Endpoints (JSON Server)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books` | List all books |
| GET | `/books?ownerId=1` | Books by user |
| GET | `/books/:id` | Single book |
| POST | `/books` | Create book |
| PUT | `/books/:id` | Update book |
| DELETE | `/books/:id` | Delete book |
| GET | `/reviews?bookId=1` | Reviews for book |
| POST | `/reviews` | Add review |
| DELETE | `/reviews/:id` | Delete review |
| GET | `/users?email=x&password=y` | Login |
| POST | `/users` | Register |
| PATCH | `/users/:id` | Update profile |
