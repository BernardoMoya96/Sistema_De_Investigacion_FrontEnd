import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/app-config-props';

@Injectable({
  providedIn: 'root'
})
export class WebGeneratorService {

  constructor(private http: HttpClient) { }


  public getContentByResearcherSection(researcher:string|null, sectionId:number) {
    return this.http.get(AppConfig.BASE_URL + "/contenido/web?investigador=" + researcher + "&seccion=" + sectionId,{responseType:"text"});
  }

  public getCurrentResearchGroup(researcher:string) {
    return this.http.get(AppConfig.BASE_URL + "/investigador/" + researcher +"/alumnos");
  }

  public getFormerResearchGroup(researcher:string) {
    return this.http.get(AppConfig.BASE_URL + "/investigador/" + researcher +"/alumnos/previo");
  }

  public getCarousel(researcher: string) {
    return this.http.get(AppConfig.BASE_URL + "/contenido/carousel/" +researcher);
  }

  public getResearcherInfo(researcher: string) {
    return this.http.get(AppConfig.BASE_URL + "/investigador/" + researcher);
  }

  public sendEmail(payload: any) {
    return this.http.post(AppConfig.BASE_URL + "/investigador/email", payload, {responseType: 'text'});
  }

  public getBannerContent(researcherEmail: string) {
    return this.http.get(AppConfig.BASE_URL +"/contenido/banner/" + researcherEmail);
  }

  public getProyects(investigador: string, start: number, end: number) {
    return this.http.get(AppConfig.BASE_URL + "/investigador/proyectos/"+investigador+"/"+start+"/"+end);
  }

  public countProjects(investigador: string) {
    return this.http.get(AppConfig.BASE_URL + "/investigador/proyectos/count/"+investigador, {responseType: 'text'});
  }

  public getPublicacionesByResearcher(researcher: string, year:number) {
    return this.http.get(AppConfig.BASE_URL + "/investigador/publicaciones/"+researcher+"/"+year);
  }
}
