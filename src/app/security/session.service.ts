import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from '../app-config-props';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public userSession: User | undefined;
  private userToken: string | undefined;

  constructor(private cookieService: CookieService) { }

  public getUserToken() {
    return this.userToken;
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  public getUserSession() {
    if (!this.userSession) {
      var value = this.cookieService.get(AppConfig.COOKIE_KEY);
      if (value) {
        this.userSession = JSON.parse(value);
        if (!this.userToken) {
          this.userToken = this.userSession?.token;
        }
      }
    }
    return this.userSession;
  }

  public setUser(user: User) {
    this.cookieService.set(AppConfig.COOKIE_KEY, JSON.stringify(user), 7);
    this.userSession = user;
    this.userToken = user.token;
    this.loggedIn.next(true);
  }

  public logout() {
    this.cookieService.delete(AppConfig.COOKIE_KEY);
    this.userSession = undefined;
    this.userToken = undefined;
    this.loggedIn.next(false);
  }
}
