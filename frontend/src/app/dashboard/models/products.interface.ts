export interface Product {
	id?: number;
	name: string;
	price: number;
	description: string;
}

export interface ProductRes {
	products: Product[];
	totalPages: number;
}

export interface SalesOrder {
	id?: number;
	customer_name: string;
	email: string;
	phone_num: string;
	address: string;
	product_ids: number[];
}

export interface Order {
	id: string;
	order_date: string;
	total: number;
	products: { name: string; quantity: number; price: number }[];
	userId: number;
	email: string;
	address: string;
}
