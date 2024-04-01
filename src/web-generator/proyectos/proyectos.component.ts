import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { StaticContentService } from 'src/static-content/static-content.service';
import { WebGeneratorService } from '../web-generator.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
  sectionName:string = "PROYECTOS";
  researcher:string | undefined;
  content:any;
  sectionId:number | null | undefined;
  proyectos:Array<any> = [];
  totalPages:number = 0;
  colSize:number = 3;
  currentPage:number = 1;
  screenWidth:any;

  constructor(private route: ActivatedRoute, private webService: WebGeneratorService, private contentService: StaticContentService,
  private sanitizer: DomSanitizer, private cd:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth - 500;
    this.route.params.subscribe(paramPath => {
      this.researcher = paramPath.researcher; 
      this.fetchStaticContent();
      this.fetchProjectsByRange(1);
    })   
  }

  fetchProjectsByRange(page:number) {
    let start = (page - 1) * this.colSize;
    this.webService.countProjects(this.researcher!).subscribe(count => {
      this.totalPages = +count;
      this.cd.detectChanges();
      this.webService.getProyects(this.researcher!, start, start + this.colSize).subscribe((res:any) => {
        this.proyectos = res as Array<any>;
      });
    });
  }

  loadPage($pageNo:number) {
    this.fetchProjectsByRange($pageNo);
  }

  fetchStaticContent() {
    this.contentService.getSectionIdByName(this.sectionName!).subscribe(res => {
      this.sectionId = +res;
      this.webService.getContentByResearcherSection(this.researcher!, this.sectionId).subscribe(res=> {
        if (res.length == 0)
          this.content = "Contenido no disponible";
        else {
          this.content = this.sanitizer.bypassSecurityTrustHtml(res);
        }      
      }, err => {
        console.log("errored", err)
      });
    });   
  }

}
