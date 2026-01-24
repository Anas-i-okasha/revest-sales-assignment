export interface Product {
	id?: number;
	name: string;
	price: number;
	description: string;
}

export interface SalesOrder {
	id?: number;
	customer_name: string;
	email: string;
	phone_num: string;
	address: string;
	product_ids: number[];
}
