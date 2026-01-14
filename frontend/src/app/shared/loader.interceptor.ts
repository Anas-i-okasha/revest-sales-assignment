import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { UserInfo } from '../auth/auth.interface';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private auth: AuthService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler) {
		const userInfo: UserInfo = this.auth.getCurrentUserInfo();

		if (userInfo) {
			const cloned = req.clone({
				headers: req.headers.set('Authorization', `Bearer ${userInfo.accessToken}`)
			});
			return next.handle(cloned);
		}
		return next.handle(req);
	}
}
