import { Request, Response, Router } from 'express';
import { AuthController } from '../controller/auth.controller';

const router: Router = Router();
const controller = new AuthController();

// TODO:: middleware to validate Input

router.post('/login', (req: Request, res: Response) => controller.login(req, res));
router.post('/register', (req: Request, res: Response) => controller.register(req, res));

export default router;
