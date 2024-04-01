import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';

import { StaticContentRoutingModule } from './static-content-routing.module';
import { ContentEditorComponent } from './content-editor/content-editor.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BannerEditorComponent } from './banner-editor/banner-editor.component';



@NgModule({
  declarations: [
    ContentEditorComponent,
    BannerEditorComponent
  ],
  imports: [
    CommonModule, BrowserModule, HttpClientModule,
    StaticContentRoutingModule, EditorModule, FormsModule
  ]
})
export class StaticContentModule { }
