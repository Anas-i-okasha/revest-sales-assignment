import { body, param, query } from 'express-validator';
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
		.withMessage('Invalid order status')
		.default(OrderStatus.PENDING),

	body('order_date')
		.optional()
		.isInt()
		.withMessage('Order date is required')
		.isInt()
		.withMessage('Order date must be timestamp unix'),

	body('product_ids')
		.isArray({ min: 1 })
		.withMessage('Product Ids must be a non-empty array of number'),
];

export const getSalesOrdersValidator = [
	query('customer_name')
		.optional()
		.isString()
		.trim()
		.isLength({ min: 2 })
		.withMessage('Customer name must be at least 2 characters'),

	query('email').optional().isEmail().withMessage('Invalid email format').trim(),

	query('phone_num')
		.optional()
		.isString()
		.isLength({ min: 10 })
		.withMessage('Invalid phone number'),

	query('status')
		.optional()
		.isIn([OrderStatus.PENDING, OrderStatus.COMPLETED, OrderStatus.CANCELLED])
		.withMessage('Invalid order status'),

	query('order_date').optional().isInt().withMessage('Invalid order timestamp date '),
	query('user_id').optional().isInt().withMessage('User ID must be an integer'),
];

export const updateProductValidator = [
	param('id').isInt({ gt: 0 }).withMessage('Product ID must be a positive integer'),

	body('name')
		.optional()
		.isString()
		.trim()
		.isLength({ min: 5, max: 255 })
		.withMessage('Name must be between 2 and 255 characters'),

	body('description')
		.optional()
		.isString()
		.trim()
		.isLength({ max: 1000 })
		.withMessage('Description is too long'),

	body('price')
		.optional()
		.isInt()
		.withMessage('Price must be a valid decimal with up to 2 digits'),

	body('is_active').optional().isBoolean().withMessage('is_active must be boolean'),
];
