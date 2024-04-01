import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'
import { WebGeneratorService } from '../web-generator.service';

@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css'],
  providers: [NgbCarouselConfig],
  encapsulation: ViewEncapsulation.None
})
export class CarruselComponent implements OnInit {


  @Input() researcher:string | undefined;
  public screenWidth: any;
  public screenHeight: any;

  //images = [1055, 194, 368].map((n) => `https://picsum.photos/id/${n}/900/500`);
  images:Array<any> = [];

  constructor(config: NgbCarouselConfig, private webGenService: WebGeneratorService) {
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = true;
    config.showNavigationIndicators = false;
    config.interval=1000 * 5; // 5 secs
  }
  
  ngOnInit() {
    console.log("researcher is", this.researcher)
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.webGenService.getCarousel(this.researcher!).subscribe(res => {
      this.images = res as Array<any>;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

}
