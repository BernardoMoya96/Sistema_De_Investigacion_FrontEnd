import { Component, OnInit } from '@angular/core';
import { SessionService } from '../app/security/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private sessionService:SessionService) { }

  userFullName = ""

  ngOnInit(): void {
    var user = this.sessionService.getUserSession();
    if (user) {
     this.userFullName += user.nombres ? user.nombres.toUpperCase()+" " : "";
     this.userFullName += user.apellidoPaterno ?  user.apellidoPaterno.toUpperCase()+" " : "";
     this.userFullName += user.apellidoMaterno ? user.apellidoMaterno.toUpperCase() : "";
    }
  }

}
