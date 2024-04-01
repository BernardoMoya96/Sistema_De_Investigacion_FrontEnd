import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AppConfig } from '../app-config-props';
import { User } from '../models/User';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private sessionService: SessionService, private router: Router, private cookieService: CookieService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.sessionService.getUserSession();
    const cookieVal = this.cookieService.get(AppConfig.COOKIE_KEY);
    if (currentUser) {
      if (currentUser.tipoUsuario == 4)
        return true;
      else {
        this.router.navigate(['non-authorized']);
        return false;
      }
    } else if (cookieVal) {
      try {
        this.sessionService.setUser(JSON.parse(cookieVal));
        var user: User = this.sessionService.getUserSession();
        if (user.tipoUsuario == 4)
          return true;
        else {
          this.router.navigate(['non-authorized']);
          return false;
        }
      } catch(err) {
        return false;
      }
    }
    // redirect to login 
    window.location.replace(AppConfig.LOGIN_URL+"?returnUrl="+window.location.href)
    return false;
  }
  
}
