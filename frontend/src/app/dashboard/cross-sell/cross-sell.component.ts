import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Product } from '../models/products.interface';
import { SalesService } from '../sales.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../models/cart.service';

@Component({
	selector: 'app-cross-sell',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './cross-sell.component.html',
	styleUrls: ['./cross-sell.component.css']
})
export class CrossSellComponent implements AfterViewInit {
	@ViewChild('addProductModal') addProductModal!: ElementRef<HTMLDivElement>;

	products: Product[] = [];
	isAdmin = true;

	newProduct: Product = { name: '', price: 0, description: '' };

	constructor(
		private productService: SalesService,
		private cartService: CartService
	) {}

	ngOnInit(): void {
		this.loadProducts();
	}

	ngAfterViewInit(): void {
		
	}

	loadProducts() {
		this.productService.getProducts().subscribe((response) => {
			this.products = response.data;
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
}
