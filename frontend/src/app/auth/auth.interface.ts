export interface UserInfo {
	first_name: string;
	last_name: string;
	accessToken: string;
}

export interface LoginResponse {
	id: number;
	accessToken: string;
	firstName: string;
	lastName: string;
	email: string;
	isAdmin: boolean;
}

export interface LoginForm {
	email: string;
	password: string;
}

export interface RegisterForm {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	confirm_password: string;
}
