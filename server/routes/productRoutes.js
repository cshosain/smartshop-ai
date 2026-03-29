import express from 'express';
import {
  getProducts, getProductById, getCategories,
  createProduct, updateProduct, deleteProduct,
  getSimilarProducts, createReview, getProductReviews,
} from '../controllers/productController.js';
import { protect, adminOnly, optionalProtect } from '../middleware/authMiddleware.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

router.get('/',                getProducts);
router.get('/categories/all',  getCategories);

// All routes with :id are protected by validateObjectId
router.get('/:id',             validateObjectId('id'), optionalProtect,        getProductById);
router.get('/:id/similar',     validateObjectId('id'),                         getSimilarProducts);
router.get('/:id/reviews',     validateObjectId('id'),                         getProductReviews);
router.post('/:id/reviews',    validateObjectId('id'), protect,                createReview);
router.put('/:id',             validateObjectId('id'), protect, adminOnly,     updateProduct);
router.delete('/:id',          validateObjectId('id'), protect, adminOnly,     deleteProduct);
router.post('/',                                       protect, adminOnly,     createProduct);

export default router;