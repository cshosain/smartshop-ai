import express from 'express';
import {
  getProfile, updateProfile, toggleWishlist,
  getRecommendations, getAllUsers, deleteUser,
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

router.get('/profile',               protect,                              getProfile);
router.put('/profile',               protect,                              updateProfile);
router.get('/recommendations',        protect,                              getRecommendations);
router.post('/wishlist/:productId',   validateObjectId('productId'), protect, toggleWishlist);
router.get('/',                       protect, adminOnly,                  getAllUsers);
router.delete('/:id',                 validateObjectId('id'), protect, adminOnly, deleteUser);

export default router;