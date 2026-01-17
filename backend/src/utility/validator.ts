import { body } from 'express-validator';
import { OrderStatus } from '../entities/salesOrder.entity';

export const loginValidator = [
	body('email').isEmail().withMessage('Email must be valid'),

	body('password').notEmpty().withMessage('Password is required'),
];

export const registerValidator = [
	body('first_name').notEmpty().withMessage('First Name is required'),
	body('last_name').notEmpty().withMessage('Last Name is required'),
	body('email').isEmail().withMessage('Invalid email'),
	body('confirm_password')
		.isLength({ min: 6 })
		.notEmpty()
		.withMessage('Confirm password is required'),
	body('password')
		.isLength({ min: 6 })
		.notEmpty()
		.withMessage('Password must be at least 6 characters'),
];

export const createProductValidator = [
	body('name').notEmpty().isString().withMessage('product name is required').trim(),

	body('description').notEmpty().isString().withMessage('product description name is required'),

	body('price').notEmpty().withMessage('price product Invalid'),
];

export const salesOrderValidator = [
	body('customer_name')
		.notEmpty()
		.withMessage('Customer name is required')
		.isLength({ min: 2, max: 100 })
		.withMessage('Customer name must be between 2 and 100 characters')
		.trim(),

	body('email')
		.notEmpty()
		.withMessage('Email is required')
		.isEmail()
		.withMessage('Invalid email address'),

	body('phone_num')
		.notEmpty()
		.withMessage('Phone number is required')
		.isMobilePhone('any')
		.withMessage('Invalid phone number'),

	body('status')
		.optional()
		.isIn([OrderStatus.PENDING, OrderStatus.COMPLETED, OrderStatus.CANCELLED])
		.withMessage('Invalid order status'),

	body('order_date')
		.notEmpty()
		.isInt()
		.withMessage('Order date is required')
		.isInt()
		.withMessage('Order date must be timestamp unix'),

	body('product_ids').isArray({ min: 1 }).withMessage('Product Ids must be a non-empty array of number'),
];
