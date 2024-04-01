import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaticContentRoutingModule } from 'src/static-content/static-content-routing.module';
import { WebGeneratorRoutingModule } from 'src/web-generator/web-generator-routing.module';
import { NotAuthorizedComponent } from './security/not-authorized/not-authorized.component';
import { NotFoundComponent } from './security/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'non-authorized',
    component: NotAuthorizedComponent 
  }, 
  {
    path: 'not-found',
    component: NotFoundComponent,
  }/*,
  {
    path: '**', redirectTo: 'not-found'
  }*/

];

@NgModule({
  imports: [WebGeneratorRoutingModule, StaticContentRoutingModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
