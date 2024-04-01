import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../app/app-config-props';
import { User } from '../app/models/User';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  adminEndpoint:string = AppConfig.BASE_URL + "/admin";
  userEndpoint:string = this.adminEndpoint + "/usuario";

  constructor(private http: HttpClient) { }

  public saveUser(user:User) {
    return this.http.post(this.userEndpoint, user, {responseType: 'text'});
  }

  public updateUser(user:User) {
    return this.http.put(this.userEndpoint, user, {responseType: 'text'});
  }

  public getUserById(userId: number) {
    return this.http.get(this.userEndpoint + "/" + userId);
  }

  public fetchAllUsers() {
    return this.http.get(this.adminEndpoint + "/usuarios/lista").toPromise();
  }

  public fetchAllColaboradores(){
    return this.http.get(this.adminEndpoint +"/usuarios/externos").toPromise();
  }

  public fetchAllStudents(){
    return this.http.get(this.adminEndpoint +"/usuarios/estudiantes").toPromise();
  }

  public fetchAllInvestigadores(){
    return this.http.get(this.adminEndpoint +"/usuarios/investigadores").toPromise();
  }

  public deleteUser(userId: string) {
    return this.http.delete(this.userEndpoint + "/" + userId, {responseType: 'text'});
  }
}
