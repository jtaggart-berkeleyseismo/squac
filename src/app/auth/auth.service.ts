import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user';
import { Router } from '@angular/router';

// Data returned from server
export interface AuthResponseData {
  token: string;
}

@Injectable({
  providedIn: 'root'
})

// Handles log in logic and API requests for login
export class AuthService {
  user = new BehaviorSubject<User>(null); // Currently active user
  private tokenExpirationTimer: any; // Time left before token expires

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // Checks if user data exists in browser
  autologin() {

    // Looks for local user data
    const userData: {
      email: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    // if there's a user, log them in
    const loadedUser = new User(userData.email, userData._token, new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autologout(expirationDuration);
      this.user.next(loadedUser);
    }
  }

  // after user enters data, log them in
  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://squac.pnsn.org/user/token/',
      {
        'email' : email,
        'password' : password
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => {
        // TODO: Get expiration time from Jon
        this.handleAuth(email, resData.token, 3600);
      })
    );
  }

  // after user hits log out, wipe server
  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  // Logs out user after expiration time passes
  autologout(expirationDuration: number) {
    console.log('expires in (Minutes)', expirationDuration / (1000 * 60));
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  // Handles login errors
  // TODO: match to errors passed from server
  private handleError(errorRes: HttpErrorResponse) {
    console.log(errorRes.error);
    let errorMessage = 'An unknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Password invalid';
        break;
    }
    return throwError(errorMessage);
  }

  // after login, save user data
  private handleAuth(email: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      token,
      expirationDate
    );
    localStorage.setItem('userData', JSON.stringify(user));
    this.autologout(expiresIn * 1000);
    this.user.next(user);
  }
}
