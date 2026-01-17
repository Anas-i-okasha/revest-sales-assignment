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
			const { customer_name, email, phone_num, status, order_date } = req.query;

			const query = salesOrderRepo.createQueryBuilder('order').leftJoinAndSelect('order.products', 'product').where('order.is_deleted IS NULL');

			if (customer_name) {
				query.andWhere('order.customer_name ILIKE :customerName', {
					customerName: `%${customer_name}%`,
				});
			}

			if (email) 
				query.andWhere('order.email ILIKE :email', { email: `%${email}%` });

			if (phone_num) {
				query.andWhere('order.phone_num ILIKE :mobileNumber', {
					mobileNumber: `%${phone_num}%`,
				});
			}

			if (status) 
				query.andWhere('order.status = :status', { status });

			if (order_date) 
				query.andWhere('order.order_date = :order_date', { order_date });

			const orders = await query.getMany();

			return res.status(200).json({
				message: 'Sales order list',
				data: orders
			});
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

			if (order_date)
				order_date = new Date(order_date*1000);
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
				//! We need to check the response valid or not
				const apiResponse = await this.handleThirdPartyRequest(order);

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

			//! Please Note Revest Team
			/******
				 * Please Note (I think there is something wrong!):
				 * - The response I received contains HTML constant (response.data).
				 * - The status is 200 instead of 201, and the statusText is "OK"!!.
				 * Could you please check this and update me regarding the expected response from this API?
			*******/
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
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
				},
			);

			console.log('Third Party API response---->', response);

			return response;
		} catch (error) {
			console.error('Third-party API error:', error);
			return null;
		}
	}
}