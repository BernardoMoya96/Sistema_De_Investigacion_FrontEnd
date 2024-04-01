import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { WebGeneratorService } from '../web-generator.service';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css']
})
export class PersonasComponent implements OnInit {

  constructor(private webGenService:WebGeneratorService, private route:ActivatedRoute, private _sanitizer: DomSanitizer) { }

  students:Array<any> = [];
  researcher:string = "";
  section:string = 'actual';
  ngOnInit(): void {
    this.route.params.subscribe(paramPath => {
      this.researcher = paramPath.researcher; 
      this.loadGpo(null,this.section);
    });    
  }

  loadGpo($event:any,gpo:string) {
    if ($event) {
      $event.preventDefault();
    }
    this.section = gpo;
    if (gpo == 'actual') {
      this.webGenService.getCurrentResearchGroup(this.researcher).subscribe(res => {
        this.students = res as Array<any>;
        for (let student of this.students) {
          if (student.img) {
            student.img = this._sanitizer.bypassSecurityTrustResourceUrl(student.img);
          }
        }
        console.log("got students", this.students)
      });
    } else if (gpo == 'anterior') {
      this.webGenService.getFormerResearchGroup(this.researcher).subscribe(res => {
        this.students = res as Array<any>;
        for (let student of this.students) {
          if (student.img) {
            student.img = this._sanitizer.bypassSecurityTrustResourceUrl(student.img);
          }
        }
        console.log("got students", this.students)
      });
    }
  }

}
