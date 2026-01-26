import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Product } from '../models/products.interface';
import { SalesService } from '../sales.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../models/cart.service';
import { AuthService } from '../../auth/auth.service';

@Component({
	selector: 'app-cross-sell',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './cross-sell.component.html',
	styleUrls: ['./cross-sell.component.css']
})
export class CrossSellComponent implements OnInit, AfterViewInit {
	@ViewChild('addProductModal') addProductModal!: ElementRef<HTMLDivElement>;

	products: Product[] = [];
	isAdmin = true;
	page: number = 1;
	totalPages: number = 1;
	pageLimit: number = 10

	newProduct: Product = { name: '', price: 0, description: '' };

	constructor(
		private productService: SalesService,
		private cartService: CartService,
		private authService: AuthService
	) {}

	ngOnInit(): void {
		this.productService.searchTerm$.subscribe((term) => {
			this.loadProducts(term);
		});

		this.productService.page$.subscribe((page) => {
			this.page = page;
			this.loadProducts();
		});
	}

	ngAfterViewInit(): void {}

	loadProducts(search: string='') {
		this.productService.getProducts({page: this.page, limit: this.pageLimit, search : search}).subscribe((response) => {
			this.products = response.data;
			this.totalPages = response.totalPages;
		});
	}

	openModal() {
		const modalEl = this.addProductModal.nativeElement;
		modalEl.classList.add('show');
		modalEl.style.display = 'block';
		modalEl.setAttribute('aria-hidden', 'false');
		document.body.classList.add('modal-open');

		const backdrop = document.createElement('div');
		backdrop.className = 'modal-backdrop fade show';
		backdrop.id = 'customBackdrop';
		document.body.appendChild(backdrop);
	}

	closeModal() {
		const modalEl = this.addProductModal.nativeElement;
		modalEl.classList.remove('show');
		modalEl.style.display = 'none';
		modalEl.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('modal-open');

		const backdrop = document.getElementById('customBackdrop');
		backdrop?.remove();
	}

	addProduct() {
		const productToAdd = { ...this.newProduct };
		this.products.unshift(productToAdd);

		this.productService.addProduct(productToAdd).subscribe((response) => {
			console.log('Product added:', response);
		});

		this.resetForm();
		this.closeModal();
	}

	resetForm() {
		this.newProduct = { name: '', price: 0, description: '' };
	}

	addToCart(product: Product) {
		this.cartService.addToCart(product);
		alert(`${product.name} added to cart!`);
	}

	get userIsAdmin(): boolean {
		return this.authService.getCurrentUserInfo().isAdmin || false;
	}

	nextPage() {
		if (this.page < this.totalPages) {
			this.productService.setPage(this.page + 1);
		}
	}

	prevPage() {
		if (this.page > 1) {
			this.productService.setPage(this.page - 1);
		}
	}
}
