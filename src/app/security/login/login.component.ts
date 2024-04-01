import { Component, OnInit } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from 'src/app/app-config-props';
import { LookupService } from 'src/app/lookup.service';
import { AppModalService } from 'src/app/modals/app-modal.service';
import { User } from 'src/app/models/User';
import { SessionService } from '../session.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService, private route: ActivatedRoute,
    private router: Router, private sessionService: SessionService, private cookieService: CookieService,
    private modalService:AppModalService, private lookupService: LookupService) { }

  loginFB: FormGroup = new FormGroup({});
  returnUrl: string  = 'inicio';
  fieldTextType: boolean = false;


  ngOnInit(): void {
    // get return url from query param
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'inicio';
    if (this.returnUrl.trim() == '%2F' || this.returnUrl.trim() == '/')
      this.returnUrl = 'inicio' 
    var cookie = this.cookieService.get(AppConfig.COOKIE_KEY);
    if(cookie && this.returnUrl !== 'logout') {
      window.location.replace(this.returnUrl);
    }
    var email:FormControl = new FormControl('', [Validators.email, Validators.required]);
    var password:FormControl = new FormControl('', Validators.required);
    this.loginFB = new FormGroup({email,password});
  }

  login() {
    this.loginService.doLogin(this.$fb['email'].value, this.$fb['password'].value).subscribe((res:any) => {
      // login successfull
      let usr = res as User;
      if (res['roles'] && res['roles'].length > 0) {
        if (res['roles'].length == 1) {
          usr.tipoUsuario = res['roles'][0];
          this.setUserAndNavigate(usr);
        } else {
          this.lookupService.lookupUserRolesById(usr.id).subscribe(opts => {
            this.modalService.openUserRoleSelection(opts as Array<any>).then((userRole => {
              usr.tipoUsuario = userRole;
              this.setUserAndNavigate(usr);
            }));
          });
        }
      }
    });
  }

  setUserAndNavigate(usr:User){
    this.sessionService.setUser(usr);
    window.location.replace(this.returnUrl);
  }

  get $fb() {
    return this.loginFB.controls;
  }

toggleFieldTextType() {
  this.fieldTextType = !this.fieldTextType;
}

}
