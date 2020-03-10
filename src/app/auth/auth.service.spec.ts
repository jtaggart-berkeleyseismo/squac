import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MockSquacApiService } from '../squacapi.service.mock';
import { SquacApiService } from '../squacapi.service';
import { AuthComponent } from './auth.component';

describe('AuthService', () => {
  let router: Router;
  let httpClientSpy: { get: jasmine.Spy};
  let authService: AuthService;
  const mockSquacApiService = new MockSquacApiService(  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: AuthComponent},
          { path: '', redirectTo: 'dashboards', pathMatch: 'full'},
        ])
      ],
      providers: [
        { provide: SquacApiService, useValue: mockSquacApiService }
      ]
    });

    router = TestBed.get(Router);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    authService = TestBed.get(AuthService);
  });

  beforeEach(() => {
    let store = {};

    //set up fake local storage to test against
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
    spyOn(localStorage, 'getItem')
      .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(mockLocalStorage.clear);
  });
  

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should log existing user in', ()=> {
    spyOn(authService, "autologout");
    let expDate = new Date().getTime()+10000;
    
    localStorage.setItem('userData', JSON.stringify({ email: "email", token: "token", tokenExpirationDate: expDate}));

    authService.autologin();
    expect(authService.autologout).toHaveBeenCalled();
  });

  it('should log new user in', ()=> {

  });

  it('should not log in if no user data', ()=>{
    spyOn(authService, "autologout");
    localStorage.clear();

    authService.autologin();

    expect(localStorage.getItem('userData')).toBeNull();
    expect(authService.autologout).not.toHaveBeenCalled();
  });

  it('should log user out', ()=> {
    localStorage.setItem('userData', JSON.stringify({ email: "", token: "", tokenExpirationDate: "string"}));

    authService.logout();

    expect(localStorage.getItem('userData')).toBeNull();
  });
  
  it('should log user out after time expires', fakeAsync( ()=>{
    spyOn(authService, "logout");

    authService.autologout(1);

    tick(1);
    expect(authService.logout).toHaveBeenCalled();

  }));

});
