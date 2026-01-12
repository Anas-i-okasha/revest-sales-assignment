import { Router } from 'express';
// import { createSalesOrder, getSalesOrders } from '../controller/salesOrder.controller';
// import { createSalesOrder } from '../controller/salesOrder.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// router.post('/', authMiddleware, createSalesOrder);
// router.get('/', getSalesOrders);

export default router;
