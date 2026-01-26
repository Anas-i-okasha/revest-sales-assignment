import { Request, Response } from 'express';
import axios from 'axios';
import { SalesOrderRepository } from '../config/repositories';
import { DataSource } from 'typeorm';
import { Product } from '../entities/products.entity';
import { SalesOrder } from '../entities/salesOrder.entity';
import { EmailService } from '../services/email.service';
import { User } from '../entities/user.entity';

const emailService = new EmailService();
const salesOrderRepo = SalesOrderRepository;

/****
 * Create Sales Order
 ****/

export class Sales {
	constructor(private connection: DataSource) {}

	async getSalesOrders(req: Request, res: Response) {
		try {
			const { customer_name, email, phone_num, status, order_date, user_id, page=1, limit=10 } = req.query;
			const skip = (+page - 1) * (+limit);
	
			const query = salesOrderRepo.createQueryBuilder('so').leftJoinAndSelect('so.products', 'product').where('so.deleted_at IS NULL');

			if (customer_name) {
				query.andWhere('so.customer_name ILIKE :customerName', {
					customerName: `%${customer_name}%`,
				});
			}

			if (email) 
				query.andWhere('so.email ILIKE :email', { email: `%${email}%` });

			if (phone_num) {
				query.andWhere('so.phone_num ILIKE :mobileNumber', {
					mobileNumber: `%${phone_num}%`,
				});
			}

			if (user_id)
				query.andWhere('so.user_id = :user_id', { user_id: +user_id });

			if (status) 
				query.andWhere('so.status = :status', { status });

			if (order_date) 
				query.andWhere('so.order_date = :order_date', { order_date });

			// Pagination
			query.skip(skip).take(+limit);

			const [orders, total] = await query.getManyAndCount();

			return res.status(200).json({
				message: 'Sales order list',
				data: orders,
				total,
				pageNum: page,
				pageLimit: limit,
				totalPages: Math.ceil(total / +limit),
			});
		} catch (error) {
			console.error('getSalesOrders error:', error);
			return res.status(500).json({ message: 'Server error while fetching orders' });
		}
	}

	async createSalesOrder(req: Request, res: Response) {
		try {
			let { customer_name, email, phone_num, address, status, order_date=Math.floor(Date.now() / 1000), product_ids } = req.body;
			const user_id = req.session.user.id;

			if (!Array.isArray(product_ids)) 
				product_ids = [product_ids];

			if (order_date) 
				order_date = new Date(order_date * 1000); // convert unix timestamp

			const order = await this.connection.transaction(async (manager) => {

				const products = await manager.findByIds(Product, product_ids);
				if (!products.length) 
					throw new Error('No valid products found');

				const user = await manager.findOne(User, { where: { id: user_id } });
				if (!user) 
					throw new Error('User not found');

				const newOrder = manager.create(SalesOrder, {
					customer_name,
					email,
					phone_num,
					address,
					status,
					order_date,
					products,
					user,
				});

				await manager.save(newOrder);

				const apiResponse = await this.handleThirdPartyRequest(newOrder);

				// Send confirmation email to customer
				await this.sendOrderConfirmationEmail(newOrder);

				return newOrder;
			});

			return res.status(201).json({ err: null, res: order });
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
			/******
			 * Please Note (I used a fake third party API available online!):
			 * - The response I received contains response.data.
			 * - The status is 200 where the process completed else there are something error!!.
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

			console.log('Third Party API response---->', response.data);
			if (!response || response.status !== 200)
				throw new Error('Third-party API failed');

			return response.data;
		} catch (error) {
			console.error('Third-party API error:', error);
			return null;
		}
	}

	async sendOrderConfirmationEmail(order: SalesOrder) {
		try {
			if (!order.email) return;

			const templateData = {
				customerName: order.customer_name,
				address: order.address,
				orderDate: order.order_date.toISOString(),
				products: order.products.map((p) => ({ name: p.name, price: p.price })),
				total: order.products.reduce((sum, p) => sum + Number(p.price), 0),
			};

			const envelope = { to: order.email, subject: 'Your order has been received!' };

			await emailService.sendTemplateEmail('userSalesOrder', envelope, templateData);
		} catch (error) {
			console.error('Error sending order confirmation email:', error);
		}
	}
}