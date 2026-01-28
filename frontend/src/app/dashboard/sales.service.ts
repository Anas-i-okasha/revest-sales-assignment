import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order, Product, ProductRes, SalesOrder } from './models/products.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SalesService {
	private API_URL = '/api/products';
	private SALES_ORDER_URL = '/api/sales-order';

	private searchTermSubject = new BehaviorSubject<string>('');
	private pageSubject = new BehaviorSubject<number>(1);

	searchTerm$ = this.searchTermSubject.asObservable();
	page$ = this.pageSubject.asObservable();

	setSearchTerm(term: string) {
		this.pageSubject.next(1); // reset page on new search
		this.searchTermSubject.next(term);
	}

	setPage(page: number) {
		this.pageSubject.next(page);
	}

	constructor(private http: HttpClient) {}

	getProducts(params: { search: string, page: number, limit: number}) {
		return this.http.get<{ totalPages: ProductRes['totalPages'], data: ProductRes['products'] }>(this.API_URL, {
			params: params,
			observe: "body"
		});
	}

	addProduct(product: FormData) {
		return this.http.post<{ data: Product}>(this.API_URL, product);
	}

	createSalesOrder(cartItems: SalesOrder) {
		return this.http.post(`${this.SALES_ORDER_URL}`, cartItems);
	}

	getSalesOrderByUser(userId: number) {
		return this.http.get<{ data: Order[] }>(`${this.SALES_ORDER_URL}`, {
			observe: 'body',
			params: { user_id: userId }
		});
	}

	deleteProduct(productId: number) {
		return this.http.delete(`${this.API_URL}/${productId}`);
	}
}
