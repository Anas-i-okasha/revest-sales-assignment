import { Request, Response, Router } from 'express';
import { AuthController } from '../controller/auth.controller';
import { loginValidator, registerValidator } from '../utility/validator';
import { validate } from '../middleware/validate.middleware';

const router: Router = Router();
const controller = new AuthController();

router.post('/login', loginValidator, validate, (req: Request, res: Response) =>
	controller.login(req, res),
);
router.post('/register', registerValidator, validate, (req: Request, res: Response) =>
	controller.register(req, res),
);

export default router;
