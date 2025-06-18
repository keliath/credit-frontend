import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user && user !== 'undefined') {
      try {
        this.currentUserSubject.next(JSON.parse(user));
      } catch (e) {
        this.currentUserSubject.next(null);
        localStorage.removeItem('user');
      }
    } else {
      this.currentUserSubject.next(null);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          console.log('Login response:', response);
          localStorage.setItem('token', response.token);
          const user: User = {
            username: response.username,
            email: response.email,
            role: response.role,
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, userData)
      .pipe(
        tap((response) => {
          console.log('Register response:', response);
          localStorage.setItem('token', response.token);
          const user: User = {
            username: response.username,
            email: response.email,
            role: response.role,
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAnalyst(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Analyst';
  }

  isApplicant(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'User';
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Admin';
  }

  whoami(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/whoami`);
  }
}
