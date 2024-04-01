import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StaticContentService } from 'src/static-content/static-content.service';
import { WebGeneratorService } from '../web-generator.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {

 
  researcher:string | undefined;
  content:any;
  sectionId:number | null | undefined;
  showError:boolean = false;

  constructor(private route: ActivatedRoute, private webService: WebGeneratorService, private contentService: StaticContentService) { }

  ngOnInit(): void {
    this.route.params.subscribe(paramPath => {
      this.researcher = paramPath.researcher; 
      this.fetchContent();
    })
     
  }

  fetchContent() {
    this.contentService.getSectionIdByName("inicio").subscribe(res => {
      this.sectionId = +res;
      if (this.sectionId > 0) {
        this.showError = false;
        this.webService.getContentByResearcherSection(this.researcher!, this.sectionId).subscribe(res=> {
          if (res.length == 0)
            this.content = "Contenido no disponible";
          else
            this.content = res;
          console.log("contenido is ", this.content)
        }, err => {
          console.log("errored", err)
        });
      } else {
        this.showError = true;
      }
    });   
  }

}
