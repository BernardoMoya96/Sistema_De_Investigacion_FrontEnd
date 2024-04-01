import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/security/auth.guard';
import { InvestigadorGuard } from 'src/app/security/investigador.guard';
import { InvestigadorListingComponent } from './investigador-listing/investigador-listing.component';
import { InvestigadorComponent } from './investigador.component';

const routes: Routes = [
  {
    path:'investigador',
    component: InvestigadorComponent
  },
  {
    
    path: 'investigadorlisting',
    component: InvestigadorListingComponent,
    canActivate: [AuthGuard, InvestigadorGuard]
  },
  {
    path:'investigador/investigador-listing/:mode/:proyectoId',
    // path:'proyecto/proyecto-detail',
    component: InvestigadorListingComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestigadorRoutingModule { }
