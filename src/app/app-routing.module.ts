import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestigadorRoutingModule } from 'src/investigador/investigador-routing.module';
import { TesisRoutingModule } from 'src/tesis/tesis-routing.module';
import { AdminComponent } from '../admin/admin.component';
import { UserDetailComponent } from '../admin/user-detail/user-detail.component';
import { HomeComponent } from '../home/home.component';
import { AdminGuard } from './security/admin.guard';
import { AuthGuard } from './security/auth.guard';
import { LoginComponent } from './security/login/login.component';
import { NonAuthorizedComponent } from './security/non-authorized/non-authorized.component';
import { NotFoundComponent } from './security/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'inicio',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminComponent
    ,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/user-detail/:mode/:userId',
    component: UserDetailComponent
    ,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'non-authorized',
    component: NonAuthorizedComponent
  },
  { path: '**', redirectTo: '404' },
  { path: '404', component: NotFoundComponent}
];

@NgModule({
  imports: [InvestigadorRoutingModule, TesisRoutingModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
