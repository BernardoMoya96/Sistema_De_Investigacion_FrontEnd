import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/security/auth.guard';
import { BannerEditorComponent } from './banner-editor/banner-editor.component';
import { ContentEditorComponent } from './content-editor/content-editor.component';

const routes: Routes = [
  {
    path: 'editor/:researcher/encabezado',
    component: BannerEditorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editor/:researcher/:sectionName',
    component: ContentEditorComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticContentRoutingModule { }
