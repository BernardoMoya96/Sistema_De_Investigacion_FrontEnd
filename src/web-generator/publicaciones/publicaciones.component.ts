import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebGeneratorService } from '../web-generator.service';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent implements OnInit {

  sectionName:string = "PUBLICACIONES";
  researcher:string | undefined;
  publicaciones:Array<any> = [];
  currentYear:number = new Date().getFullYear();
  selectedYear:number = this.currentYear;

  constructor(private route: ActivatedRoute, private webService: WebGeneratorService, 
   private cd:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.params.subscribe(paramPath => {
      this.researcher = paramPath.researcher; 
      this.fetchPublicacionesByYear();
    })   
  }

  fetchPublicacionesByYear() {
    this.webService.getPublicacionesByResearcher(this.researcher!,this.selectedYear).subscribe(res => {
      if (res) {
        this.publicaciones = res as Array<any>;
        this.cd.detectChanges();
      }
    });
  }

  selectYear(year:number) {
    this.selectedYear = year;
    this.fetchPublicacionesByYear();
  }
}
