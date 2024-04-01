import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { IntroComponent } from './intro/intro.component';
import { PersonasComponent } from './personas/personas.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { WebGeneratorComponent } from './web-generator.component';

const routes: Routes = [
  {
    path: 'p/:researcher/inicio',
    component: IntroComponent 
  },
  {
    path: 'p/:researcher/personas',
    component: PersonasComponent 
  },
  {
    path: 'p/:researcher/proyectos',
    component: ProyectosComponent 
  },
  {
    path: 'p/:researcher/publicaciones',
    component: PublicacionesComponent 
  },
  {
    path: 'p/:researcher/contacto',
    component: ContactComponent 
  },
  {
    path: 'p/:researcher/:sectionName',
    component: WebGeneratorComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebGeneratorRoutingModule { }
