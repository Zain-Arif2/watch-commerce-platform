# CHRONOLUX — Premium Luxury Watches E-Commerce Platform

## Project Overview

CHRONOLUX is a full-stack MERN e-commerce platform for luxury watches, featuring a
dark/gold premium design system, guest and authenticated checkout via Stripe, an
admin dashboard for product/order/customer management, and transactional email
notifications (order confirmation, newsletter, contact form).

## Tech Stack

### Frontend
- React 18 + Vite
- React Router v7 (with future flags enabled) + lazy-loaded routes
- Redux Toolkit & RTK Query (`injectEndpoints` pattern for modular API slices)
- Tailwind CSS
- Framer Motion (`LazyMotion` + `domAnimation` for reduced bundle size)
- React Hook Form
- React Hot Toast
- Lucide React (icons)

### Backend
- Node.js + Express.js
- MongoDB & Mongoose
- JWT Authentication
- Stripe Checkout (payment processing)
- Nodemailer (transactional emails)
- Helmet (security headers)
- Express Rate Limiting

## Project Structure

```
.
├── backend/
│   ├── config/            # Database config
│   ├── controllers/       # Request handlers (auth, products, orders, cart, wishlist, newsletter, contact)
│   ├── models/             # MongoDB schemas (User, Product, Order, Cart, Wishlist, Newsletter, ContactMessage, ...)
│   ├── repositories/       # Data access layer (e.g. OrderRepository)
│   ├── routes/             # API routes
│   ├── services/           # Business logic (OrderService, EmailService)
│   ├── middleware/         # Auth, error handling
│   └── server.js           # Entry point
└── frontend/
    ├── src/
    │   ├── app/            # Redux store
    │   ├── features/        # Redux slices & RTK Query API slices (auth, cart, wishlist, products, newsletter, contact)
    │   ├── components/       # Reusable UI (Navbar, Footer, ProductCard, Hero, Testimonials, LazyMotionProvider, ErrorBoundary)
    │   ├── layouts/          # StoreLayout (shared customer-facing layout)
    │   ├── pages/            # Home, Shop, Product, Cart, Wishlist, Checkout, About, Contact, Account, Admin/*
    │   └── main.jsx          # Entry point
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- Stripe account (test mode keys)
- Gmail account with an App Password (for Nodemailer)

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Production Build
```bash
cd frontend
npm run build
npm run preview
```

## Features

### Customer-Facing
- Premium dark/gold design system with glassmorphism accents
- Product browsing with filters, search, and brand pages
- Product detail pages with reviews
- Shopping cart and wishlist (works for both guests and logged-in users, with
  guest data synced to `localStorage`)
- Stripe Checkout integration with order confirmation email
- Guest and authenticated checkout flows
- Newsletter subscription with welcome email
- Contact form with admin notification + customer auto-reply email
- Animated testimonials slider (auto-play, direction-aware transitions)
- Responsive design across all breakpoints
- SEO meta injection per page (custom `useEffect`-based, no external package)

### Admin Panel
- Dashboard overview
- Product management
- Order management (view orders, update status)
- Customer management

### Engineering Highlights
- RTK Query with `injectEndpoints` for modular, scalable API slices
- Code-split routes via `React.lazy` + `Suspense`
- `LazyMotion` (Framer Motion) to reduce animation bundle size
- GPU-composited CSS animations (`transform`-based) instead of layout-triggering
  properties, to minimize layout shift and improve Lighthouse CLS/performance scores
- Background (non-blocking) transactional emails — API responses return
  immediately after DB writes, with email sending handled asynchronously
- Database seeding script that imports realistic product data from the
  DummyJSON API (`ProductImportService`), automatically organizing products
  into brands and categories
- Centralized error handling and toast-based user feedback

## Performance

Lighthouse scores (production build) have been iteratively optimized:
- Reduced JS bundle size via `LazyMotion` and code splitting
- Fixed non-composited animations (dot indicators, transitions)
- Reduced main-thread blocking time

## Contributing

This is a portfolio project built to demonstrate full-stack MERN development skills.

## License

MIT