import { AppDataSource } from './data-source';
import { User } from '../entities/user.entity';
import { Product } from '../entities/products.entity';
import { SalesOrder } from '../entities/salesOrder.entity';

export const UserRepository = AppDataSource.getRepository(User);
export const ProductsRepository = AppDataSource.getRepository(Product);
export const SalesOrderRepository = AppDataSource.getRepository(SalesOrder);
