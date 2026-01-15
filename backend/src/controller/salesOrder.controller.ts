import { Request, Response } from 'express';
import axios from 'axios';
import { SalesOrderRepository } from '../config/repositories';
import { DataSource, EntityManager } from 'typeorm';
import { Product } from '../entities/products.entity';
import { SalesOrder } from '../entities/salesOrder.entity';

const salesOrderRepo = SalesOrderRepository;

/****
 * Create Sales Order
 ****/

export class Sales {
	constructor(private connection: DataSource) {}

	async getSalesOrders(req: Request, res: Response) {
		try {
			const { customerName, email, mobileNumber, status, orderDate } = req.query;

			const query = salesOrderRepo
				.createQueryBuilder('order')
				.leftJoinAndSelect('order.products', 'product');

			if (customerName) {
				query.andWhere('order.customerName ILIKE :customerName', {
					customerName: `%${customerName}%`,
				});
			}

			if (email) 
				query.andWhere('order.email ILIKE :email', { email: `%${email}%` });

			if (mobileNumber) {
				query.andWhere('order.mobileNumber ILIKE :mobileNumber', {
					mobileNumber: `%${mobileNumber}%`,
				});
			}

			if (status) 
				query.andWhere('order.status = :status', { status });

			if (orderDate) 
				query.andWhere('order.orderDate = :orderDate', { orderDate });

			const orders = await query.getMany();

			return { err: null, res: orders };
		} catch (error) {
			console.error('getSalesOrders error:', error);
			return res.status(500).json({ message: 'Server error while fetching orders' });
		}
	}

	async createSalesOrder(req: Request, res: Response) {
		try {
			let { customer_name, email, phone_num, status, order_date, product_ids } = req.body;
			if (!Array.isArray(product_ids)) 
				product_ids = [product_ids];

			// Inner function to be executed within a transaction
			const innerFunction = async (entityManager: EntityManager) => {
				const products = await entityManager.findByIds(Product, product_ids);
				if (!products.length) {
					// Throwing an error inside a transaction will rollback automatically
					throw new Error('No valid products found');
				}

				// Create order using transaction manager
				const order = entityManager.create(SalesOrder, {
					customer_name,
					email,
					phone_num,
					status,
					order_date,
					products,
				});

				await entityManager.save(order);

				// Trigger third-party request
				const apiResponse = await this.handleThirdPartyRequest(order);

				// If third-party API failed, throw an error to rollback the transaction
				if (!apiResponse || apiResponse.status !== 200)
					throw new Error('Third-party API failed');

				return order;
			};

			// Execute transaction with the inner function
			const order = await this.connection.transaction(innerFunction);

			return res.json({ err: null, res: order });
		} catch (error) {
			console.error('createSalesOrder error:', error);
			return res.status(500).json({ message: error || 'Server error while creating order' });
		}
	}

	async handleThirdPartyRequest(order: any) {
		const salesOrderThirdPartyAPI = process.env.SALES_ORDER_THIRD_PARTY_API;
		const thirdPartyAPIToken = process.env.SALES_ORDER_THIRD_PARTY_API_TOKEN;

		if (!salesOrderThirdPartyAPI || !thirdPartyAPIToken) {
			console.warn('Third-party API config missing');
			return null;
		}

		try {
			const response = await axios.post(
				salesOrderThirdPartyAPI,
				{
					customerName: order.customer_name,
					email: order.email,
					mobileNumber: order.phone_num,
					status: order.status,
					orderDate: order.order_date,
					products: order.products,
				},
				{
					headers: {
						Authorization: `Bearer ${thirdPartyAPIToken}`,
					},
				},
			);

			return response;
		} catch (error) {
			console.error('Third-party API error:', error);
			return null;
		}
	}
}