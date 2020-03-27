import { of } from 'rxjs';

export class MockPasswordResetService {
  private url = '/password_reset';
  private token : string;
  constructor() {

  }

  // /password_reset
  // to get token

  resetPassword(email : string) {
    return of(email);
  }

  validateToken(token : string) {
    this.token = token;
    return of(token);
  }

  confirmPassword(password) {
    return of(password, this.token);
  }


}
