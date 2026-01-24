import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginForm, RegisterForm, UserInfo } from './auth.interface';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private API_URL = '/api/auth';

	constructor(private http: HttpClient) {}

	getCurrentUserInfo() {
		const userStr = localStorage.getItem('currentUser');
		return userStr ? JSON.parse(userStr) : {};
	}

	logout() {
		localStorage.removeItem('currentUser');
	}

	isLoggedIn(): boolean {
		return !!Object.keys(this.getCurrentUserInfo()).length;
	}

	login(form: LoginForm) {
		return this.http.post(`${this.API_URL}/login`, form);
	}

	register(form: RegisterForm) {
		return this.http.post(`${this.API_URL}/register`, form);
	}
}
