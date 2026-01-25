import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order, Product, SalesOrder } from './models/products.interface';

@Injectable({ providedIn: 'root' })
export class SalesService {
	private API_URL = '/api/products';
	private SALES_ORDER_URL = '/api/sales-order';

	constructor(private http: HttpClient) {}

	getProducts() {
		return this.http.get<{ data: Product[] }>(this.API_URL);
	}

	addProduct(product: Product) {
		return this.http.post(this.API_URL, product);
	}

	createSalesOrder(cartItems: SalesOrder) {
		return this.http.post(`${this.SALES_ORDER_URL}`, cartItems);
	}

	getSalesOrderByUser(userId: number) {
		return this.http.get<{data: Order[]}>(`${this.SALES_ORDER_URL}`, {
			observe: 'body',
			params: { user_id: userId }
		});
	}
}
