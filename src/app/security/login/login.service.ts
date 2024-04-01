import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../app-config-props';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  public doLogin(email: string , password: string ) {
    return this.http.post(AppConfig.BASE_URL + "/login/auth",{email, password});
  }
}
