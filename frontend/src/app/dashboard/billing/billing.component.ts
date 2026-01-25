import { Component } from '@angular/core';
import { Order, SalesOrder } from '../models/products.interface';
import { AuthService } from '../../auth/auth.service';
import { SalesService } from '../sales.service';
import { CommonModule } from '@angular/common';
import { OrderDetailsComponent } from '../order-details/order-details.component';

@Component({
	selector: 'app-billing',
	standalone: true,
	imports: [CommonModule, OrderDetailsComponent],
	templateUrl: './billing.component.html',
	styleUrl: './billing.component.css'
})
export class BillingComponent {
	orders: Order[] = [];
	selectedOrder: Order | null = null;

	constructor(
		private orderService: SalesService,
		private userService: AuthService
	) {}

	ngOnInit() {
		const userInfo = this.userService.getCurrentUserInfo();
		this.orderService.getSalesOrderByUser(userInfo.id).subscribe((res: { data: Order[] }) => {
			this.orders = res.data;
		});
	}

	openOrder(order: Order) {
		this.selectedOrder = order;
	}

	closeModal() {
		this.selectedOrder = null;
	}
}
