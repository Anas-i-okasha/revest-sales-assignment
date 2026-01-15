import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utility/auth';


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) 
        return res.status(401).json({ message: 'Authorization header missing' });

	const [type, token] = authHeader.split(' ');

	if (type !== 'Bearer' || !token)
		return res.status(401).json({ message: 'Invalid authorization format' });

	try {
		const decoded = verifyToken(token);
		//TODO: we should get the userInfo and token then save these info inside the session (req.session) to be used with each request
		// req.session.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};
