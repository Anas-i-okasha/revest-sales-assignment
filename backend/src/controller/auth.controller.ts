import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { signToken } from '../utility/auth';
import { UserRepository } from '../config/repositories';

const userRepo = UserRepository;

export class AuthController {
	async register(req: Request, res: Response) {
		try {
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

			const { password: _pass, ...userWithoutPassword } = user;

			return res.status(201).json({
				message: 'User registered successfully',
				userWithoutPassword,
			});
		} catch (ex) {
			console.error(ex, 'register');
			res.status(500).json({ message: 'Server error:: register' });
		}
	};

	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;

			const userInfo = await userRepo.findOne({ where: { email } });
			if (!userInfo) 
				return res.status(401).json({ message: 'Invalid credentials' });

			const isValidUser = await bcrypt.compare(password, userInfo.password);
			if (!isValidUser) 
				return res.status(401).json({ message: 'Invalid credentials' });

			const token = signToken({ userId: userInfo.id, email: userInfo.email });

			return res.status(200).json({
				message: 'Login successful',
				data: {
					firstName: userInfo.first_name,
					lastName: userInfo.last_name,
					email: userInfo.email,
					accessToken: token,
				},
			});
		} catch(ex) {
			console.error(ex, 'login');
			res.status(500).json({ message: 'Server error:: login' });
		}
	};
}
