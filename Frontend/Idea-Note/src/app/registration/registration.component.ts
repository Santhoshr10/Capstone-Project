import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { User } from '../user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  user: User = { userName: '', email: '', password: '', token: '' };
  userNameError: string = ''; 
  emailError: string = '';
  passwordErrors: string[] = [];
  formError: string = '';
  showPassword = false;

  constructor(private authService: AuthserviceService, private router: Router) {}

  register(): void {
    this.userNameError = '';
    this.emailError = '';
    this.passwordErrors = [];
    this.formError = '';

    if (!this.user.userName) {
      this.userNameError = 'Username is required';
    } else if (this.user.userName.length < 5 || this.user.userName.length > 20) {
      this.userNameError = 'Username must be between 5 and 20 characters';
    }

    if (!this.user.email) {
      this.emailError = 'Email is required';
    } else if (!this.isValidEmail(this.user.email)) {
      this.emailError = 'Please enter a valid email address';
    }

    this.updatePasswordErrors();

    if (!this.isFormValid()) {
      this.formError = 'Please fill out all the details';
      return;
    }

    this.authService.register(this.user)
      .subscribe({
        next: (data) => {
          console.log('Registration Successful:', data);
          this.authService.storeAuthToken(data.token); 
          this.gotoLogin();
        },
        error: (error) => {
          console.log('Registration Failed:', error);
          if (error === 'Email already taken') {
            alert('This email is already registered. Please use a different email.');
          }
        }
      });
  }

  gotoLogin(): void {
    console.log('Navigating to login');
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  isFormValid(): boolean {
    const isUserNameValid = !this.userNameError;
    const isEmailValid = !this.emailError;
    const isPasswordValid = this.passwordErrors.length === 0 && !!this.user.password; 
  
    const isFormValid = isUserNameValid && isEmailValid && isPasswordValid;
  
    if (isFormValid) {
      this.formError = ''; 
    }
  
    return isFormValid;
  }
  
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  updatePasswordErrors() {
    this.passwordErrors = [];
  
    if (!this.user.password) {
      return; 
    }
  
    if (this.user.password.length < 8) {
      this.passwordErrors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(this.user.password)) {
      this.passwordErrors.push('Password must contain at least one uppercase letter');
    }
    if (!/\d/.test(this.user.password)) {
      this.passwordErrors.push('Password must contain at least one digit');
    }
    if (!/[^A-Za-z0-9]/.test(this.user.password)) {
      this.passwordErrors.push('Password must contain at least one special character');
    }
  }
  

  updateUserNameError() {
    if (!this.user.userName) {
      this.userNameError = '';
    } else if (this.user.userName.length >= 5) {
      this.userNameError = '';
    } else {
      this.userNameError = 'Username must be at least 5 characters long';
    }
  }

  updateEmailError() {
    if (!this.user.email) {
      this.emailError = '';
    } else if (this.isValidEmail(this.user.email)) {
      this.emailError = '';
    } else {
      this.emailError = 'Please enter a valid email address';
    }
  }
}
