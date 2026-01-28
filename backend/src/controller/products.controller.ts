import { Request, Response } from 'express';
import { ProductsRepository } from '../config/repositories';
import { Product } from '../entities/products.entity';
import { EmailService } from '../services/email.service';
import fs  from 'fs';
import path from 'path';

const emailService = new EmailService();

const productRepo = ProductsRepository;
const imagesFolder: string = '/uploads/products/';

export class Products {
	async createProduct(req: Request, res: Response) {
		try {
			const userInfo = req.session.user;
			const { name, price, description } = req.body;

			const product = productRepo.create({
				name,
				price,
				description,
				image_url: req.file? `${imagesFolder}${req.file.filename}` : null
			});
			await productRepo.save(product);

			const envelope = {
				to: userInfo.email,
				subject: 'Product Created Successfully',
			};

			const mailOptions = {
				userName: `${userInfo.first_name} ${userInfo.last_name}`,
				productName: product.name,
				productId: product.id,
				totalAmount: product.price,
			};

			await emailService.sendTemplateEmail('createOrder', envelope, mailOptions);
			return res.status(201).json({
				message: 'Product created successfully',
				data: product,
			});
		} catch (ex) {
			console.error(ex, 'createProduct');
			res.status(500).json({ message: 'Server error:: createProduct' });
		}
	}

	async getProducts(req: Request, res: Response) {
		try {
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 10;
			const search = (req.query.search as string) || '';


			const [data, total] = await productRepo.createQueryBuilder('product')
				.where('LOWER(product.name) LIKE :search', {
					search: `%${search.toLowerCase()}%`,
				})
				.skip((page - 1) * limit)
				.take(limit)
				.getManyAndCount();

			res.status(200).json({
				data,
				total,
				page,
				totalPages: Math.ceil(total / limit),
			});
		} catch (ex) {
			console.error(ex, 'getProducts');
			res.status(500).json({ message: 'Server error:: getProducts' });
		}
	}

	async getProductById(req: Request, res: Response) {
		try {
			const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

			const productInfo = await productRepo.findOneBy({ id: +productId });

			if (!productInfo) 
				return res.status(404).json({ message: 'Product not found' });

			return res.status(200).json({
				message: 'Product fetched successfully',
				data: productInfo,
			});
		} catch (ex) {
			console.error(ex, 'getProductById');
			res.status(500).json({ message: 'Server error:: getProductById' });
		}
	}

	async updateProduct(req: Request, res: Response) {
		try {
			const productId = req.params.id;

			const product = await productRepo.findOneBy({ id: +productId });
			if (!product)
				return res.status(404).json({ message: 'Product not found' });
			
			// Whitelist allowed fields
			const allowedFields: Partial<Product> = {
				name: req.body.name,
				description: req.body.description,
				price: req.body.price,
				is_active: req.body.is_active,
			};

			// Remove undefined values
			Object.keys(allowedFields).forEach((key) =>
				allowedFields[key as keyof Product] === undefined && delete allowedFields[key as keyof Product]
			);

			if (!Object.keys(allowedFields).length) {
				return res.status(400).json({
					message: 'At least one field must be provided to update',
				});
			}

			productRepo.merge(product, allowedFields);
			await productRepo.save(product);

			return res.status(200).json({
				message: 'Product updated successfully',
				data: product,
			});
		} catch (ex) {
			console.error('updateProduct error:', ex);
			return res.status(500).json({ message: 'Server error :: updateProduct' });
		}
	}

	async deleteProduct(req: Request, res: Response) {
		try {
			const productId = req.params.id;

			const product = await productRepo.findOneBy({ id: +productId });
			if (!product || !product.id) 
				return res.status(404).json({ message: 'Product not found' });

			if (product.image_url) {
				const imagePath = path.join(__dirname, '../../', product.image_url);
				await fs.rmSync(imagePath);
			}
			await productRepo.softDelete(req.params.id);

			return res.status(200).json({
				message: 'Product deleted successfully',
			});
		} catch (ex) {
			console.error(ex, 'deleteProduct');
			res.status(500).json({ message: 'Server error:: deleteProduct' });
		}
	}
}
