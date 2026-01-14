import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

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
		private authService: AuthService
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

		this.authService.login(this.loginForm.value).subscribe({
			next: (res) => console.log('Logged in successfully', res),
			error: (err) => (this.errorMessage = err.error?.message || 'Login failed')
		});
	}
}
