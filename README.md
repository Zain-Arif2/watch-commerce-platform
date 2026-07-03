# ChronoLux - Premium Luxury Watches E-Commerce Platform

## Project Overview
ChronoLux is a full-stack, production-ready e-commerce platform for luxury watches, built with modern technologies.

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Redux Toolkit & RTK Query
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Helmet (Security)
- Express Rate Limiting

## Project Structure
```
.
├── backend/              # Backend API server
│   ├── src/
│   │   ├── config/       # Database config
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, error handling
│   │   └── server.js     # Entry point
│   └── package.json
└── frontend/             # React client
    ├── src/
    │   ├── app/          # Redux store
    │   ├── features/     # Redux slices & API slices
    │   ├── components/   # Reusable UI components
    │   ├── pages/        # Page components
    │   └── main.jsx      # Entry point
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)

### Backend Setup
1. Navigate to the backend directory
   ```bash
   cd backend
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env` file (already provided)
4. Start the server
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory
   ```bash
   cd frontend
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Start the dev server
   ```bash
   npm run dev
   ```

## Features
- Premium, elegant UI design
- User authentication
- Product browsing with filters and search
- Shopping cart and wishlist
- Product reviews
- Responsive design

## Contributing
This is a portfolio project.

## License
MIT
