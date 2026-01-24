import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UserInfo } from '../auth/auth.interface';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(
		private auth: AuthService,
		private router: Router
	) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const userInfo: UserInfo = this.auth.getCurrentUserInfo();

		let clonedReq = req;

		if (userInfo?.accessToken) {
			clonedReq = req.clone({
				headers: req.headers.set('Authorization', `Bearer ${userInfo.accessToken}`)
			});
		}

		return next.handle(clonedReq).pipe(
			catchError((err) => {
				if (err instanceof HttpErrorResponse && err.status === 401) {
					// Token expired or unauthorized
					this.auth.logout(); // remove token, clear user info
					this.router.navigate(['/login']); // redirect to login
				}
				return throwError(() => err);
			})
		);
	}
}
