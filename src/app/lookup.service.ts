import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/app-config-props';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  
  lookupEndpoint:string = AppConfig.BASE_URL + "/lookup";

  constructor(private http: HttpClient) { }

  public lookupFinanciamiento() {
    return this.http.get(this.lookupEndpoint + "/financiamiento")
  }

  public lookupDecanatos() {
    return this.http.get(this.lookupEndpoint + "/decanatos")
  }   

  public lookupTiposDeUsuario() {
    return this.http.get(this.lookupEndpoint + "/participacion/usuarios")
  }  
  
  public lookupFacultad(decanatoId: number) {
    return this.http.get(this.lookupEndpoint + "/facultades/" + decanatoId)
  }

  public lookupDepartamentos(facultadId: number) {
    return this.http.get(this.lookupEndpoint + "/departamentos/" + facultadId)
  }

  public lookupUserRolesById(userId: number) {
    return this.http.get(this.lookupEndpoint + "/roles/" + userId)
  }
  
  public lookUpEstados(){
    return this.http.get(this.lookupEndpoint + "/estados/"+"P")
  }

  public lookupCamposConocimiento(){
    return this.http.get(this.lookupEndpoint + "/clasificacion/campos_conocimiento")
  }

  public lookUpCategoriaInvestigacion(){
    return this.http.get(this.lookupEndpoint +"/clasificacion/categoria_investigacion")
  }

  public lookUpTipoInvestigacion() {
    return this.http.get(this.lookupEndpoint +"/clasificacion/tipo_investigacion")
  }

  public lookUpGrado(){
    return this.http.get(this.lookupEndpoint +"/clasificacion/grado")
  }

  public lookupDiciplinaDeCampo(campoConocimientoId: number){
    return this.http.get(this.lookupEndpoint + "/clasificacion/disciplina/" + campoConocimientoId)
  }

  public lookupSubDisciplinaDeDisciplina(disciplinaId:number){
    return this.http.get(this.lookupEndpoint+"/clasificacion/subdisciplina/"+disciplinaId);
  }
}
