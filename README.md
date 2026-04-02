# DRAPE — Modern Clothing Store

A full-featured e-commerce web app built with **React + Vite**.

## Features
- 🏠 Home page with hero slider & category sections
- 👕 Category pages (T-Shirts, Shirts, Jeans, Trousers) with search & filters
- 🔍 Global search
- 🛍️ Product detail with image gallery, size/color picker
- 🛒 Shopping cart with qty controls & order summary
- 📦 Orders page with timeline
- 🚚 Order tracking by ID

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Project Structure
```
src/
  App.jsx              # Router & providers
  index.css            # Global styles & CSS variables
  main.jsx             # Entry point
  components/          # Navbar, Footer, ProductCard, SearchBar
  context/             # Cart + Toast context (AppContext.jsx)
  data/                # products.js (all mock data)
  pages/               # Home, CategoryPage, ProductDetail, Cart, Orders, TrackOrder, SearchPage
```

## Try Order Tracking
Use IDs: `DRP-20250315-001`, `DRP-20250402-002`, `DRP-20250428-003`, `DRP-20250501-004`
