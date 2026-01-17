import { Request, Response, Router } from 'express';
import { Products } from '../controller/products.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createProductValidator } from '../utility/validator';

const controller = new Products();
const router = Router();


router.post('/', authMiddleware, createProductValidator, validate, (req: Request, res: Response) =>
	controller.createProduct(req, res),
);
router.get('/', authMiddleware, (req: Request, res: Response) => controller.getProducts(req, res));
router.get('/:id', authMiddleware, (req: Request, res: Response) =>
	controller.getProductById(req, res),
);
router.put('/:id', authMiddleware, (req: Request, res: Response) =>
	controller.updateProduct(req, res),
);
router.delete('/:id', authMiddleware, (req: Request, res: Response) =>
	controller.deleteProduct(req, res),
);

export default router;
