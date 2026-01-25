import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Order } from '../models/products.interface';

@Component({
	selector: 'app-order-details',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './order-details.component.html',
	styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent {
	@Input() order!: Order; 
	@Output() close = new EventEmitter<void>();

	closeModal() {
		this.close.emit();
	}
}
