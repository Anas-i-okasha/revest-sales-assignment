import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './products.interface';

export interface CartItem extends Product {
	quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {

	private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
	cartItems$ = this.cartItemsSubject.asObservable();

	getCart(): CartItem[] {
		return this.cartItemsSubject.value;
	}

	addToCart(product: Product) {
		const cart = this.cartItemsSubject.value;
		const existing = cart.find((item) => item.id === product.id);

		if (existing) {
			existing.quantity += 1;
		} else {
			cart.push({ ...product, quantity: 1 });
		}

		this.cartItemsSubject.next([...cart]);
	}

	removeFromCart(productId: number) {
		const cart = this.cartItemsSubject.value.filter((item) => item.id !== productId);
		this.cartItemsSubject.next(cart);
	}

	clearCart() {
		this.cartItemsSubject.next([]);
	}
}
