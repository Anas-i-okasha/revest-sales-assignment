import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private API_URL = '/api/auth';

	constructor(private http: HttpClient) {}

	login(form: any) {
		return this.http.post(`${this.API_URL}/login`, form);
	}

	register(form: any) {
		return this.http.post(`${this.API_URL}/register`, form);
	}
}
