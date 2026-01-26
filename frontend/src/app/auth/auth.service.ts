import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginForm, LoginResponse, RegisterForm, UserInfo } from './auth.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private API_URL = '/api/auth';

	constructor(private http: HttpClient) {}

	private loggedIn$ = new BehaviorSubject<boolean>(this.hasUser());

	private hasUser(): boolean {
		return !!this.getCurrentUserInfo().userId;
	}

	isLoggedIn$ = this.loggedIn$.asObservable();

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
		return this.http.post<{ data: LoginResponse }>(`${this.API_URL}/login`, form);
	}

	register(form: RegisterForm) {
		return this.http.post(`${this.API_URL}/register`, form);
	}
}
