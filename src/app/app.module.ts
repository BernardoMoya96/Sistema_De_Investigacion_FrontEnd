import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StaticContentModule } from 'src/static-content/static-content.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {  NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { WebGeneratorModule } from 'src/web-generator/web-generator.module';
import { CommonModule } from '@angular/common';  
import { ConfirmationDialogComponent } from './modals/confirmation-dialog/confirmation-dialog.component';
import { NotAuthorizedComponent } from './security/not-authorized/not-authorized.component';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorInterceptorService } from './security/http-error-interceptor.service';
import { JwtInterceptorService } from './security/jwt-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppHeaderComponent } from './app-header/app-header.component';
import { NotFoundComponent } from './security/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent,
    NotAuthorizedComponent,AppHeaderComponent, NotFoundComponent
  ],
  imports: [
    BrowserModule,CommonModule, 
    AppRoutingModule, StaticContentModule, NgbModule, WebGeneratorModule
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
