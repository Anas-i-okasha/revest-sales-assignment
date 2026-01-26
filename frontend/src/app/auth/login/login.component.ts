import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginResponse } from '../auth.interface';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {
	loginForm: FormGroup;
	submitted = false;
	errorMessage = '';

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router
	) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required]
		});
	}

	get f() {
		return this.loginForm.controls;
	}

	onSubmit() {
		this.submitted = true;
		this.errorMessage = '';

		if (this.loginForm.invalid) return;

		this.authService.login(this.loginForm.value).subscribe((res: { data: LoginResponse }) => {
			// TODO: Add RBAC permissions / access functions
			const currentUser = {
				userId: res.data.id,
				firstName: res.data.firstName,
				lastName: res.data.lastName,
				accessToken: res.data.accessToken,
				isAdmin: res.data.isAdmin
			};

			localStorage.setItem('currentUser', JSON.stringify(currentUser));
			this.authService.loggedInSubject.next(true);
			return this.router.navigate(['/home']);
		});
	}
}
