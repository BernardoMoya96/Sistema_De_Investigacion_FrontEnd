import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InvestigadorRoutingModule } from './investigador-routing.module';
import { InvestigadorListingComponent } from './investigador-listing/investigador-listing.component';
import { InvestigadorComponent } from './investigador.component';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    InvestigadorComponent,
    InvestigadorListingComponent
  ],
  imports: [
    AngularSlickgridModule.forRoot(),
    BrowserModule, HttpClientModule, BrowserAnimationsModule,    
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule, MatFormFieldModule,NgbModule,
    CommonModule,
    InvestigadorRoutingModule
  ]
})
export class InvestigadorModule { }
