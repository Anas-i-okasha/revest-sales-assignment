import { Router } from 'express';
import {
	createProduct,
	getProducts,
	getProductById,
	updateProduct,
	deleteProduct,
} from '../controller/products.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createProduct);
router.get('/', authMiddleware, getProducts);
router.get('/:id', authMiddleware, getProductById);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
