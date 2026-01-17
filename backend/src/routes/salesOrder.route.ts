import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { Sales } from '../controller/salesOrder.controller';
import { AppDataSource } from '../config/data-source';
import { validate } from '../middleware/validate.middleware';
import { salesOrderValidator } from '../utility/validator';

const controller = new Sales(AppDataSource);
const router = Router();

router.post('/', authMiddleware, salesOrderValidator, validate, (req: Request, res: Response) =>
	controller.createSalesOrder(req, res),
);
router.get('/', authMiddleware, (req: Request, res: Response) =>
	controller.getSalesOrders(req, res),
);

export default router;
