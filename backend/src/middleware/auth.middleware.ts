import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utility/auth';
import { AuthController } from '../controller/auth.controller';

const authController = new AuthController();


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) 
        return res.status(401).json({ message: 'Authorization header missing' });

	const [type, token] = authHeader.split(' ');

	if (type !== 'Bearer' || !token)
		return res.status(401).json({ message: 'Invalid authorization format' });

	try {
		const decoded = verifyToken(token) as { userId: number; email: string };
		const userInfo = await authController.getUserInfo(decoded.userId, decoded.email);
		req.session.user = userInfo?.res;
		next();
	} catch (err) {
		console.error('Token verification failed:', err);
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};
