import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import errorHandler from './middleware/error.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes, { stripeWebhook } from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

connectDB();

const app = express();

app.use(helmet());

// List of allowed origins for both local dev and production
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL, // production frontend URL (Vercel)
].filter(Boolean); // removes undefined/empty values

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());
app.use(cookieParser());

// Base Route for Health Check
app.get('/', (req, res) => {
  res.send('API is running successfully!');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Vercel Serverless Function Export
export default app;