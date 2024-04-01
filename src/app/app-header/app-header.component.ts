import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { SessionService } from '../security/session.service';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {

  constructor(private sessionService: SessionService, private router: Router) { }

  isLoggedIn:boolean = false;
  isAdmin:boolean = false;
  isResearcher:boolean = false;
  userName:string = "";

  ngOnInit(): void {
    var user = this.sessionService.getUserSession();
   if(user) {
    this.isLoggedIn = true;
    this.isAdmin = user.tipoUsuario == 4;
    this.userName = user.nombres;
    this.isResearcher = user.tipoUsuario == 1;
   } else {
    this.isLoggedIn = false;
   }
  }

  logout($event:any) {
    $event.preventDefault();
    this.sessionService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  doNothing($event:any) {
    $event.preventDefault();
  }

}
