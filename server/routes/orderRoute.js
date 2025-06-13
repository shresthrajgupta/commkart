import express from 'express';

import { addOrderItems, getMyOrders, getOrderById, updateOrderToPaidPayPal, initializeOrderRazorpay, verifyOrderToPaidRazorpay, updateOrderToDelivered, getAllOrders } from '../controllers/orderController.js';

import { protect, admin } from '../middlewares/authMiddleware.js';
import checkObjectId from '../middlewares/checkObjectId.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getAllOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, checkObjectId, getOrderById);
router.route('/:id/paypal').put(protect, checkObjectId, updateOrderToPaidPayPal);
router.route('/:id/razorpay').post(protect, initializeOrderRazorpay).put(protect, checkObjectId, verifyOrderToPaidRazorpay);
router.route('/:id/deliver').put(protect, admin, checkObjectId, updateOrderToDelivered);

export default router;