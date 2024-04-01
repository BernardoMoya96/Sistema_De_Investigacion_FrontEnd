import { Component, OnInit } from '@angular/core';
import { TesisService } from '../tesis.service';

@Component({
  selector: 'app-tesis-listing',
  templateUrl: './tesis-listing.component.html',
  styleUrls: ['./tesis-listing.component.css']
})
export class TesisListingComponent implements OnInit {

  constructor(private tesisService: TesisService) { }

  orgFinanciamiento:Array<any> = [];

  ngOnInit(): void {
   
  }

}
