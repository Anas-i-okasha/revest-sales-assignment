import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { passwordMatchValidator } from '../../shared/password.validator';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css'
})
export class RegisterComponent {
	registerForm: FormGroup;
	submitted = false;
	errorMessage = '';

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router
	) {
		this.registerForm = this.fb.group(
			{
				first_name: ['', Validators.required],
				last_name: ['', Validators.required],
				email: ['', [Validators.required, Validators.email]],
				password: ['', [Validators.required, Validators.minLength(6)]],
				confirm_password: ['', Validators.required]
			},
			{ validators: passwordMatchValidator('password', 'confirm_password') }
		);
	}

	get f() {
		return this.registerForm.controls;
	}

	onSubmit() {
		this.submitted = true;
		this.errorMessage = '';

		if (this.registerForm.invalid) return;

		this.authService.register(this.registerForm.value).subscribe({
			next: (res) => this.router.navigate(['/login']),
			error: (err) => (this.errorMessage = err.error?.message || 'Registration failed')
		});
	}
}
