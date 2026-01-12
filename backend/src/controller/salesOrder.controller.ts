import { Request, Response } from 'express';
import axios from 'axios';
import { ProductsRepository, SalesOrderRepository } from '../config/repositories';

const salesOrderRepo = SalesOrderRepository;
const productRepo = ProductsRepository;

// export const createSalesOrder = async (req: Request, res: Response) => {
//     try {
//         const { customer_name, email, mobileNumber, status, orderDate, productIds } = req.body;
//         const products = await productRepo.findByIds(productIds || []);
//         const order = salesOrderRepo.create({
//             customer_name,
//             email,
//             mobileNumber,
//             status,
//             orderDate,
//             products,
//         });
    
//         await salesOrderRepo.save(order);
//         await handleThirdPartyRequest(req.body);
//     } catch(ex) {
//         throw ex;
//     }
// };

// export const getSalesOrders = async (req: Request, res: Response) => {
// 	const { name, email, mobileNumber, status, orderDate } = req.query;
// 	const query = salesOrderRepo
// 		.createQueryBuilder('order')
// 		.leftJoinAndSelect('order.products', 'product');

// 	if (name) query.andWhere('order.customerName ILIKE :name', { name: `%${name}%` });
// 	if (email) query.andWhere('order.email ILIKE :email', { email: `%${email}%` });
// 	if (mobileNumber)
// 		query.andWhere('order.mobileNumber ILIKE :mobileNumber', {
// 			mobileNumber: `%${mobileNumber}%`,
// 		});
// 	if (status) query.andWhere('order.status = :status', { status });
// 	if (orderDate) query.andWhere('order.orderDate = :orderDate', { orderDate });

// 	const orders = await query.getMany();
// 	res.json(orders);
// };

// const handleThirdPartyRequest = async (requestData, res:Response) => {
//     // Push to third-party API
//     const { customer_name, email, mobileNumber, status, orderDate, productIds } = requestData;
// 	try {
// 		await axios.post(
// 			'https://third-party-api.com/salesOrder',
// 			{
// 				customer_name,
// 				email,
// 				mobileNumber,
// 				status,
// 				orderDate,
// 				products,
// 			},
// 			{
// 				headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' },
// 			},
// 		);
// 	} catch (error) {
// 		console.error('Third-party API error:', error);
// 	}

// 	res.status(201).json(order);
// }