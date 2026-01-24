import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { CartItem, CartService } from '../models/cart.service';
import { CommonModule } from '@angular/common';
import { SalesService } from '../sales.service';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './header.component.html',
	styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
	@ViewChild('cartModal') cartModal!: ElementRef<HTMLDivElement>;

	cartItems: CartItem[] = [];
	showCartModal = false;
	images = signal(['hero1.jpg', 'hero2.jpg', 'hero3.jpg']);
	currentIndex = signal(0);

	customer_name: string = '';
	email: string = '';
	phone_num: string = '';
	address: string = '';
	status: 'PENDING' | 'COMPLETED' | 'CANCELLED' = 'PENDING';

	constructor(
		public cartService: CartService,
		public salesService: SalesService
	) {}

	ngOnInit(): void {
		this.cartService.cartItems$.subscribe((items) => {
			this.cartItems = items;
		});
	}

	next() {
		this.currentIndex.update((v) => (v + 1) % this.images().length);
	}

	openCart() {
		const modalEl = this.cartModal.nativeElement;
		modalEl.classList.add('show');
		modalEl.style.display = 'block';
		modalEl.setAttribute('aria-hidden', 'false');
		document.body.classList.add('modal-open');

		const backdrop = document.createElement('div');
		backdrop.className = 'modal-backdrop fade show';
		backdrop.id = 'cartBackdrop';
		document.body.appendChild(backdrop);
	}

	closeCart() {
		const modalEl = this.cartModal.nativeElement;
		modalEl.classList.remove('show');
		modalEl.style.display = 'none';
		modalEl.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('modal-open');

		const backdrop = document.getElementById('cartBackdrop');
		backdrop?.remove();
	}

	createSalesOrder() {
		if (!this.customer_name || !this.email || !this.phone_num || !this.address || !this.cartItems.length) {
			alert('Please fill all customer info including address');
			return;
		}

		const payload = {
			customer_name: this.customer_name,
			email: this.email,
			phone_num: this.phone_num,
			address: this.address,
			// status: this.status,
			product_ids: this.cartItems.map((i) => i.id).filter((id): id is number => id !== undefined)
		};
		debugger;

		this.salesService.createSalesOrder(payload).subscribe({
			next: (response) => {
				console.log('Sales order response:', response);
			},
			error: (error) => {
				console.error('Error creating sales order:', error);
			}
		});

		this.cartService.clearCart();
		this.closeCart();
	}

	get cartTotal(): number {
		return this.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
	}

	removeFromCart(productId: number) {
		this.cartService.removeFromCart(productId);
	}
}
