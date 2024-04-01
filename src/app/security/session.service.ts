import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../app-config-props';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

 

  public userSession: User | undefined;
  private userToken: string | undefined;

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  public getUserToken():String {
    if (!this.userToken) {
      var sess = this.getUserSession();
      this.userToken = sess ? sess.token : undefined;
    }
    return this.userToken!;
  }


  public getUserSession():User {
    if (!this.userSession) {
      var val = this.cookieService.get(AppConfig.COOKIE_KEY);
      if (val)
        this.userSession = JSON.parse(val);
    }
    return this.userSession!;
  }

  public setUser(user: User) {
    this.cookieService.set(AppConfig.COOKIE_KEY, JSON.stringify(user), 7);
    this.userSession = user;
    this.userToken = user.token;
  }

  public logout() {
    this.cookieService.delete(AppConfig.COOKIE_KEY);
    this.userSession = undefined;
    this.userToken = undefined;
    window.location.replace(AppConfig.LOGIN_URL+"?returnUrl=admin");
  }

  public getUserById(id:number) {
    return this.http.get(AppConfig.BASE_URL + "/admin/usuario/" + id);
  }

  public getUserByEmail(email:string) {
    return this.http.get(AppConfig.BASE_URL + "/admin/usuario/email/" + email);
  }
}
