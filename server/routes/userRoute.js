import express from 'express';

import { loginUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getAllUsers, getUserByID, deleteUser, updateUser, getAddress, addAdress } from '../controllers/userController.js';

import { protect, admin } from '../middlewares/authMiddleware.js';
import checkObjectId from '../middlewares/checkObjectId.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getAllUsers);
router.post('/logout', logoutUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/address').put(protect, addAdress).get(protect, getAddress);
router.route('/:id').get(protect, admin, checkObjectId, getUserByID).delete(protect, admin, checkObjectId, deleteUser).put(protect, admin, checkObjectId, updateUser);

export default router;