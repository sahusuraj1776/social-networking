import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';

import { AUTH_TOKEN_KEY, AUTH_USER_KEY, AuthUser } from './auth.model';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly _token = signal<string | null>(this.readToken());
  private readonly _user = signal<AuthUser | null>(this.readUser());

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token() && !!this._user());

  private readonly baseUrl = 'http://localhost:4000/api';

  /**
   * ✅ Login flow:
   * 1) POST /auth/login -> { token }
   * 2) Save token
   * 3) GET /user/me -> AuthUser
   * 4) Save user
   */
  login(email: string, password: string): Observable<AuthUser> {
    const payload = { email, password };

    return this.http
      .post<{ token: string }>(`${this.baseUrl}/auth/login`, payload)
      .pipe(
        tap(res => this.setToken(res.token)),          // ✅ store token first
        switchMap(() => this.fetchMe()),               // ✅ then fetch user with token
        tap(user => this.setUser(user)),               // ✅ store user after fetch
        catchError(err => {
          // optional: clear state if login fails
          this.clearAuth();
          return throwError(() => err);
        })
      );
  }

  /**
   * ✅ Fetch current user using token in signal/localStorage
   * Useful on app refresh if token exists but user not loaded.
   */
  getUser(): Observable<AuthUser> {
    return this.fetchMe().pipe(
      tap(user => this.setUser(user))
    );
  }

  logout(): void {
    this.clearAuth();
  }

  // --------------------------
  // Internal helpers
  // --------------------------
  private fetchMe(): Observable<AuthUser> {
    const token = this._token();
    if (!token) {
      return throwError(() => new Error('No token found. Please login again.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<AuthUser>(`${this.baseUrl}/user/me`, { headers });
  }

  private setToken(token: string): void {
    this._token.set(token);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  private setUser(user: AuthUser): void {
    this._user.set(user);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }

  private clearAuth(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    this._token.set(null);
    this._user.set(null);
  }

  private readToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  private readUser(): AuthUser | null {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}