import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/app-config-props';

@Injectable({
  providedIn: 'root'
})
export class StaticContentService {

  constructor(private http: HttpClient) { }


  public getContent(researcherId:number,sectionId:number) {
    return this.http.get(AppConfig.BASE_URL + "/contenido/" +researcherId+"/"+ sectionId);
  }

  public saveSectionContent(payload: any) {
    return this.http.post(AppConfig.BASE_URL + "/contenido/save", payload,{responseType: 'text'});
  }

  public getSectionIdByName(sectionName: string) {
    return this.http.get(AppConfig.BASE_URL + "/contenido/exist/section/" + sectionName, {responseType: 'text'});
  }

  public saveCarousel(researcherId:number,fileStrArr: Array<any>) {
    return this.http.post(AppConfig.BASE_URL + "/contenido/carousel/" + researcherId, fileStrArr, {responseType: 'text'});
  }

  public getCarousel(researcherId: number) {
    return this.http.get(AppConfig.BASE_URL + "/contenido/carousel/edit/" + researcherId);
  }

  public deleteCarouselFiles(researcherId: number, deletedImgs: any[]) {
    return this.http.put(AppConfig.BASE_URL + "/contenido/carousel/" + researcherId, deletedImgs, {responseType: 'text'});
  }

  public getBannerContent(researcherId: number) {
    return this.http.get(AppConfig.BASE_URL +"/contenido/banner/edit/" + researcherId);
  }

  public mergeBannerText(researcher:number, arr:any) {
    return this.http.post(AppConfig.BASE_URL + "/contenido/banner/" + researcher, arr, {responseType:'text'});
  }

  public mergeLogo(logo: any) {
    return this.http.post(AppConfig.BASE_URL + "/contenido/banner/logo", logo);
  }

}
