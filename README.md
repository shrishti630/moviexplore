# MovieXplore – TMDB Movie & TV Explorer

MovieXplore is a frontend project built with **Vanilla JavaScript**, **Tailwind CSS**, and the **TMDB REST API**.  
It focuses on clean architecture, reusable logic, and real-world API integration without using any frameworks.

---

## What This Project Shows

- Built a complete movie & TV browsing experience using only client-side JavaScript
- Integrated multiple TMDB REST APIs for movies, TV shows, search, trailers, and credits
- Designed reusable utilities for API calls, cards, sliders, and trailers
- Implemented infinite scrolling, horizontal sliders, and UI state toggles
- Structured the project using ES Modules for scalability and maintainability
- Focused on readable code, separation of concerns, and clean DOM manipulation

---

## Architecture & Design

- Uses **ES Modules** (`type="module"`) for clean imports and exports
- Clear separation of concerns:
  - `api.js` – Centralized TMDB API configuration and endpoints
  - `utils.js` – Reusable UI and helper logic (cards, trailers, scrolling)
  - Page-level scripts – Page-specific behavior only
- No frameworks or build tools
- Fully client-side rendering

---

## API Usage

This project uses **REST APIs** provided by **The Movie Database (TMDB)**.

### Types of API Calls Used

- **Trending APIs** – Daily and weekly trending movies/TV shows
- **Discovery APIs** – Popular, top-rated, and free-to-watch content
- **Search APIs** – Multi-search, movie search, and TV search
- **Details APIs** – Movie/TV details including videos
- **Credits APIs** – Cast and crew information
- **Videos APIs** – YouTube trailer retrieval

All API requests are handled via a centralized `fetchFromAPI()` helper to ensure consistency and maintainability.

---

## Screenshots

### Home Page

![Home Page](homePage.png)

### Movie Detail Page

![Movie Detail Page](movieDetailPage.png)

---

## What I Learned

- **ES Modules:** Structuring JavaScript using `import` and `export` for reusable, maintainable code
- **REST API Integration:** Consuming third-party REST APIs with query parameters, pagination, and dynamic rendering
- **API Abstraction:** Centralizing endpoints and fetch logic to reduce duplication
- **DOM Manipulation:** Dynamically creating and updating UI from API data
- **Infinite Scrolling:** Loading content progressively based on scroll position
- **UI State Management:** Handling toggles, sliders, modals, and conditional UI without frameworks
- **Responsive Design:** Building adaptive layouts using Tailwind CSS utilities
- **Clean Architecture:** Separating reusable utilities from page-specific logic for scalability

---

## TMDB API Setup

1. Create an account at https://www.themoviedb.org/
2. Generate an API key
3. Open `src/js/api.js`
4. Replace:

```js
export const API_KEY = "YOUR_TMDB_API_KEY";

## Tech Stack

- HTML5
- Tailwind CSS
- Vanilla JavaScript (ES Modules)
- TMDB REST API

---

## Author

Shrishti Pandey
Frontend practice project
```
