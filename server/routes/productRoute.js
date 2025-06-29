import express from 'express';

import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts } from '../controllers/productController.js';

import { protect, admin } from '../middlewares/authMiddleware.js';
import checkObjectId from '../middlewares/checkObjectId.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/top').get(getTopProducts);
router.route('/:id').get(checkObjectId, getProductById).put(protect, admin, checkObjectId, updateProduct).delete(protect, admin, checkObjectId, deleteProduct);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);

export default router;