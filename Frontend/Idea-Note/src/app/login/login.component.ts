import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { FormControl, Validators } from '@angular/forms';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent { 
  credentials = { email: '', password: '' };
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  errorMessage: string = '';
  showPassword = false;
  remember: boolean = false;

  constructor(private authService: AuthserviceService,private UserDataService: UserDataService, private router: Router) {}

  login(): void {
    this.errorMessage = '';
    this.UserDataService.userEmail = this.credentials.email;
    if (this.emailFormControl.invalid || this.passwordFormControl.invalid) {
      return;
    }

    if (this.emailFormControl.invalid || this.passwordFormControl.invalid) {
      return;
    }

    this.authService.login(this.credentials)
      .subscribe({
        next: (data: any) => {
          console.log('Login Successful:', data);
          this.authService.storeAuthToken(data.token);
          this.router.navigate(['/task']);
          this.showWelcomeMessage();
        },
        error: (error) => {
          console.log('Login Failed:', error);
          if (error.status === 500) {
            this.credentials.password = '';
            alert('Invalid credentials. Please enter correct email and password.');
          }
        }
    });
  }

  navigateToRegistration(): void {
    this.router.navigate(['/register']);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  showWelcomeMessage(): void {
    const loggedInUser = this.credentials.email;
    const welcomeMessage = `Welcome, ${loggedInUser}!`;
    alert(welcomeMessage);
  }
}
