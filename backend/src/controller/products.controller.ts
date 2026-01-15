import { Request, Response } from 'express';
import { ProductsRepository } from '../config/repositories';

const productRepo = ProductsRepository;

export class Products {
	async createProduct(req: Request, res: Response) {
		try {
			const product = productRepo.create(req.body);
			await productRepo.save(product);

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
			const result = await productRepo.find();
			return res.status(200).json({
				message: 'Products fetched successfully',
				data: result,
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
			const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

			const product = await productRepo.findOneBy({ id: +productId });
			if (!product) 
				return res.status(404).json({ message: 'Product not found' });

			productRepo.merge(product, req.body);
			await productRepo.save(product);

			return res.status(200).json({
				message: 'Product updated successfully',
				data: product,
			});
		} catch (ex) {
			console.error(ex, 'updateProduct');
			res.status(500).json({ message: 'Server error:: updateProduct' });
		}
	}

	async deleteProduct(req: Request, res: Response) {
		try {
			const productId = req.params.id;

			const product = await productRepo.findOneBy({ id: +productId });
			if (!product) 
				return res.status(404).json({ message: 'Product not found' });

			await productRepo.delete(req.params.id);

			return res.status(200).json({
				message: 'Product deleted successfully',
			});
		} catch (ex) {
			console.error(ex, 'deleteProduct');
			res.status(500).json({ message: 'Server error:: deleteProduct' });
		}
	}
}
