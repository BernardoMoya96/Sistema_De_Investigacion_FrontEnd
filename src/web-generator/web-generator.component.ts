import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { StaticContentService } from 'src/static-content/static-content.service';
import { WebGeneratorService } from './web-generator.service';

@Component({
  selector: 'app-web-generator',
  templateUrl: './web-generator.component.html',
  styleUrls: ['./web-generator.component.css']
})
export class WebGeneratorComponent implements OnInit {

  sectionName:string | null | undefined;
  researcher:string | undefined;
  content:any;
  sectionId:number | null | undefined;
  showError:boolean = false;

  constructor(private route: ActivatedRoute, private webService: WebGeneratorService, private contentService: StaticContentService,
  private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.route.params.subscribe(paramPath => {
      this.sectionName = paramPath.sectionName;
      this.researcher = paramPath.researcher; 
      this.fetchContent();
    })
     
  }

  fetchContent() {
    this.contentService.getSectionIdByName(this.sectionName!).subscribe(res => {
      this.sectionId = +res;
      if (this.sectionId > 0) {
        this.showError = false;
        this.webService.getContentByResearcherSection(this.researcher!, this.sectionId).subscribe(res=> {
          if (res.length == 0)
            this.content = "Contenido no disponible";
          else {
            this.content = this.sanitizer.bypassSecurityTrustHtml(res);
          }
            
        }, err => {
          console.log("errored", err)
        });
      } else {
        this.showError = true;
      }
    });   
  }

}
