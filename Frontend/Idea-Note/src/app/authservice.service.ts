import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  private baseUrl = 'http://localhost:9000';
  private authTokenKey = 'authToken';
  private userEmailKey = 'userEmail'; 
  private userKey = 'currentUser';
  public isLoggedInEmitter: EventEmitter<boolean> = new EventEmitter<boolean>(); 

  constructor(private http: HttpClient) { }

  register(user: User): Observable<User> {
    const registerUrl = `${this.baseUrl}/api/v2/register`;
    return this.http.post<User>(registerUrl, user).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409 && error.error && error.error.message === 'User Already Exists') {
          return throwError('Email already taken');
        }
        return throwError(error);
      })
    );
  }

  login(credentials: { email: string, password: string }): Observable<User> {
    const loginUrl = `${this.baseUrl}/api/v1/login`;
    return this.http.post<User>(loginUrl, credentials).pipe(
      tap(data => {
        this.storeAuthToken(data.token);
        this.storeUser(data);
        this.storeUserEmail(credentials.email);
        this.isLoggedInEmitter.emit(true); 
      })
    );
  }

  storeAuthToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  clearAuthToken(): void {
    localStorage.removeItem(this.authTokenKey);
  }

  storeUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  clearUser(): void {
    localStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    const authToken = this.getAuthToken();
    return !!authToken; 
  }

  storeUserEmail(email: string): void {
    localStorage.setItem(this.userEmailKey, email); 
  }

  getUserEmail(): string | null {
    return localStorage.getItem(this.userEmailKey); 
  }
}
