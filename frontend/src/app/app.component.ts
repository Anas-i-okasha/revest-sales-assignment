import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './dashboard/header/header.component';
import { FooterComponent } from './dashboard/footer/footer.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	title = 'RevestApp';

	isLoggedIn: boolean = false;

	constructor(private authService: AuthService) {}

	ngOnInit() {
		this.authService.isLoggedIn$.subscribe((status) => {
			this.isLoggedIn = status
		})
	}
}
