import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TesisRoutingModule } from './tesis-routing.module';
import { TesisListingComponent } from './tesis-listing/tesis-listing.component';


@NgModule({
  declarations: [
    TesisListingComponent
  ],
  imports: [
    CommonModule,
    TesisRoutingModule
  ]
})
export class TesisModule { }
