import { Injectable } from '@angular/core';
import { AuthUser } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + 'user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private userToken: string;
  private tokenTimer: any;
  private userAuthStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getIsUserAuthenticated() {
    return this.isAuthenticated;
  }

  getUserAuthStatusListener() {
    return this.userAuthStatusListener;
  }

  getToken() {
    return this.userToken;
  }

  login(email: string, password: string) {
    const authUser: AuthUser = {
      email: email,
      password: password
    };
    this.http.post<{ token: string, expiresIn: number }>(BACKEND_URL + 'login', authUser)
      .subscribe(response => {
        const token = response.token;
        this.userToken = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          console.log('ex: ' + expiresInDuration);
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userAuthStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + (expiresInDuration * 1000));
          this.saveAuthData(token, expirationDate);
          this.router.navigate(['']);
        }
      });
  }

  createUser(email: string, password: string) {
    const authUser: AuthUser = {
      email: email,
      password: password
    };
    this.http
      .post(BACKEND_URL + 'signup', authUser)
      .subscribe(response => {
        this.router.navigate(['']);
      }, error => {
        this.userAuthStatusListener.next(false);
      });
  }

  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.isAuthenticated = false;
    this.userToken = null;
    this.userAuthStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['']);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    console.log('saveAuthData');
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    console.log('clearauthdata');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }

  autoAuthUser() {
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }
    const now = new Date();
    const expiresIn = authData.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.userToken = authData.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.userAuthStatusListener.next(true);
    }
  }
}
