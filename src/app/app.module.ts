import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './security/login/login.component';
import { NotFoundComponent } from './security/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { JwtInterceptorService } from './security/jwt-interceptor.service';
import { InvestigadorModule } from 'src/investigador/investigador.module';
import { TesisModule } from 'src/tesis/tesis.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from './modals/confirmation-dialog/confirmation-dialog.component';
import { HttpErrorInterceptorService } from './security/http-error-interceptor.service';
import { AdminComponent } from '../admin/admin.component';
import { UserDetailComponent } from '../admin/user-detail/user-detail.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { HomeComponent } from './../home/home.component';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { NonAuthorizedComponent } from './security/non-authorized/non-authorized.component';
import { UserRoleSelectionDialogComponent } from './modals/user-role-selection-dialog/user-role-selection-dialog.component';
import {MatSelectModule} from '@angular/material/select'; 

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    ConfirmationDialogComponent,
    AdminComponent,
    UserDetailComponent,
    AppHeaderComponent,
    HomeComponent,
    NonAuthorizedComponent,
    UserRoleSelectionDialogComponent
  ],
  imports: [
    AngularSlickgridModule.forRoot(),
    BrowserModule, HttpClientModule, BrowserAnimationsModule,
    AppRoutingModule,
    BrowserAnimationsModule, MatSelectModule,
    FormsModule, ReactiveFormsModule, MatFormFieldModule, InvestigadorModule, TesisModule, NgbModule
  ],
  providers: [
    CookieService, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
