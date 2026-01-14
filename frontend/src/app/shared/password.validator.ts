import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(password: string, confirmPassword: string): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const pass = control.get(password)?.value;
		const confirmPass = control.get(confirmPassword)?.value;
		return pass === confirmPass ? null : { passwordMismatch: true };
	};
}
