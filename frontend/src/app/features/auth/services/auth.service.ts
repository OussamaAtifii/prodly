import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '@models/user.model';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {
    console.log('Auth service');
    this.checkSession();
  }

  private API_URL = environment.API_URL;
  private _isAuthenticated = signal<boolean>(false);
  private _user = signal<User | null>(null);

  isAuthenticated = this._isAuthenticated.asReadonly();
  user = this._user.asReadonly();

  httpClient = inject(HttpClient);

  login(loginData: { email: string; password: string }) {
    const { email } = loginData;
    const { password } = loginData;

    return this.httpClient
      .post<User>(
        `${this.API_URL}/user/login`,
        { email, password },
        { withCredentials: true },
      )
      .pipe(
        tap({
          next: (value) => {
            this._user.set(value);
            this._isAuthenticated.set(true);
          },
          error: () => {
            this._user.set(null);
            this._isAuthenticated.set(false);
          },
          complete: () => console.log('Finished'),
        }),
      );
  }

  logout() {
    return this.httpClient
      .get(`${this.API_URL}/user/logout`, {
        withCredentials: true,
      })
      .pipe(
        tap({
          next: () => this._isAuthenticated.set(false),
        }),
      );
  }

  register(registerData: {
    username: string;
    email: string;
    password: string;
  }) {
    const { username } = registerData;
    const { email } = registerData;
    const { password } = registerData;

    return this.httpClient
      .post<User>(
        `${this.API_URL}/user/register`,
        { username, email, password },
        { withCredentials: true },
      )
      .pipe(
        tap({
          next: (value) => {
            this._user.set(value);
            this._isAuthenticated.set(true);
          },
          error: () => {
            this._user.set(null);
            this._isAuthenticated.set(false);
          },
        }),
      );
  }

  private checkSession() {
    this.httpClient
      .get<User>(`${this.API_URL}/user/session`, { withCredentials: true })
      .subscribe({
        next: (value) => {
          this._user.set(value);
          this._isAuthenticated.set(true);
        },
        error: () => {
          this._user.set(null);
          this._isAuthenticated.set(false);
        },
      });
  }
}
