import express from 'express';

const router = express.Router();

// Routes will be added in Phase 2
router.get('/', (req, res) => res.json({ message: 'Product routes working ✅' }));

export default router;