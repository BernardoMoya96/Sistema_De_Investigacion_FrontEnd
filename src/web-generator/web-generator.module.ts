import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';

import { WebGeneratorRoutingModule } from './web-generator-routing.module';
import { WebGeneratorComponent } from './web-generator.component';
import { PersonasComponent } from './personas/personas.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { CarruselComponent } from './carrusel/carrusel.component';
import { NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {  NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { IntroComponent } from './intro/intro.component';
import { ContactComponent } from './contact/contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    WebGeneratorComponent,
    PersonasComponent,
    ProyectosComponent,
    PublicacionesComponent,
    CarruselComponent,
    IntroComponent,
    ContactComponent
  ],
  imports: [
    CommonModule,BrowserModule,FormsModule, ReactiveFormsModule,
    WebGeneratorRoutingModule, NgbModule
  ],
  schemas: [ NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA ]
})
export class WebGeneratorModule { }
