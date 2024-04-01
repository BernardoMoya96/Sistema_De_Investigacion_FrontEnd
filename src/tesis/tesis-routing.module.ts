import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/security/auth.guard';
import { TesisListingComponent } from './tesis-listing/tesis-listing.component';

const routes: Routes = [
  {
    path: 'tesis',
    component: TesisListingComponent,
    canActivate: [AuthGuard]  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TesisRoutingModule { }
