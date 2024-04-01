import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../app/app-config-props';

import { Proyecto } from 'src/app/models/Proyecto';

@Injectable({
  providedIn: 'root'
})
export class InvestigadorService {


  baseURL:string = AppConfig.BASE_URL+"/proyecto";  

  // baseURL: string = "http://localhost:9180/sirms/proyecto";
  constructor(private http: HttpClient) { }

  public saveProyecto(proyecto:Proyecto) {
    return this.http.post(this.baseURL+"/add", proyecto, {responseType: 'text'});
  }

  public updateProyecto(proyecto:Proyecto) {
    return this.http.put(this.baseURL +"/update", proyecto, {responseType: 'text'});
  }

  public getProyectoById(proyectoId: number) {
    return this.http.get(this.baseURL + "/" + proyectoId);
  }

  public fetchAllProyectos() {
    return this.http.get(this.baseURL+"/lista").toPromise();
  }

  public deleteProyectoById(proyectoId: number){
    return this.http.delete(this.baseURL + "/" + proyectoId, {responseType: 'text'});
  }

}
