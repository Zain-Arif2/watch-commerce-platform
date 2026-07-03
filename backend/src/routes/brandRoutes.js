import express from 'express';
import { getBrands, getBrandBySlug } from '../controllers/brandController.js';

const router = express.Router();

router.get('/', getBrands);
router.get('/slug/:slug', getBrandBySlug);

export default router;
