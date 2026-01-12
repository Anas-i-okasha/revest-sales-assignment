import { Request, Response } from 'express';
import { ProductsRepository } from '../config/repositories';

const productRepo = ProductsRepository;

export const createProduct = async (req: Request, res: Response) => {
	try {
		const product = productRepo.create(req.body);
		await productRepo.save(product);
		res.status(201).json(product);
	} catch (ex) {
		console.error(ex, 'createProduct');
		res.status(500).json({ message: 'Server error:: createProduct' });
	}
};

export const getProducts = async (req: Request, res: Response) => {
	try {
		return await productRepo.find();
	} catch (ex) {
		console.error(ex, 'getProducts');
		res.status(500).json({ message: 'Server error:: getProducts' });
	}
};

export const getProductById = async (req: Request, res: Response) => {
	try {
		const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

		const productInfo = await productRepo.findOneBy({ id: +productId });

		if (!productInfo) 
            return res.status(404).json({ message: 'Product not found' });

		return productInfo;
	} catch (ex) {
		console.error(ex, 'getProductById');
		res.status(500).json({ message: 'Server error:: getProductById' });
	}
};

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

		const product = await productRepo.findOneBy({ id: +productId });
		if (!product) 
            return res.status(404).json({ message: 'Product not found' });

		productRepo.merge(product, req.body);
		await productRepo.save(product);

		return product;
	} catch (ex) {
		console.error(ex, 'updateProduct');
		res.status(500).json({ message: 'Server error:: updateProduct' });
	}
};

export const deleteProduct = async (req: Request, res: Response) => {
	try {
		await productRepo.delete(req.params.id);
		res.status(204).send();

	} catch (ex) {
		console.error(ex, 'deleteProduct');
		res.status(500).json({ message: 'Server error:: deleteProduct' });
	}
};
