import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { signToken } from '../utility/auth';
import { UserRepository } from '../config/repositories';

const userRepo = UserRepository;

export default class AuthController {
	register = async (req: Request, res: Response) => {
		const { first_name, last_name, email, password, confirm_password } = req.body;

		const existing = await userRepo.findOne({ where: { email } });
		if (existing) 
			return res.status(400).json({ message: 'Email already exists' });

		if (password != confirm_password)
			return res.status(400).json({ message: 'password and confirm password not match!' });

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = userRepo.create({
			first_name,
			last_name,
			email,
			password: hashedPassword,
		});

		await userRepo.save(user);

		const token = signToken({ userId: user.id, email: user.email });

		return res.status(201).json({
			message: 'User registered successfully',
			token,
		});
	};

	login = async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const userInfo = await userRepo.findOne({ where: { email } });
		if (!userInfo)
			return res.status(401).json({ message: 'Invalid credentials' });

		const isValidUser = await bcrypt.compare(password, userInfo.password);
		if (!isValidUser) 
			return res.status(401).json({ message: 'Invalid credentials' });

		const token = signToken({ userId: userInfo.id, email: userInfo.email });

		return res.json({ token });
	};
}
