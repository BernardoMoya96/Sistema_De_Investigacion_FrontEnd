import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private sessionService: SessionService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const currentUser = this.sessionService.getUserSession();
      if (!currentUser) {
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
        return false;
      } else if (currentUser.tipoUsuario != 4) {
        this.router.navigate(['/non-authorized']);
        return false;
      }
      return true;
  }
  
}
