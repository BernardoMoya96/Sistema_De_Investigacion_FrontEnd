import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebGeneratorService } from 'src/web-generator/web-generator.service';
import { User } from '../models/User';
import { SessionService } from '../security/session.service';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {

  constructor(private sessionService: SessionService, private router: Router, 
    private webGenService: WebGeneratorService) { }

  isLoggedIn:boolean = false;
  isAdmin:boolean = false;
  isResearcher:boolean = false;
  userName:string = "";
  editMode:boolean = false;
  prefix:string=""
  activeSection = "";
  researcherId:number|undefined;
  fullResearcherName:string = "";
  customBanner:any = null;

  ngOnInit(): void {
    var user = this.sessionService.getUserSession();
    this.editMode = window.location.href.includes("editor")
   if(user) {
    this.isLoggedIn = true;
    this.isAdmin = user.tipoUsuario == 4;
    this.userName = user.nombres;
    this.isResearcher = user.tipoUsuario == 1;
   } else {
    this.isLoggedIn = false;
   }
   let url = window.location.href;
   if (this.editMode) {
    let idx = url.indexOf("/editor/"); 
    if (idx > 0) {
      let p = url.substring(idx + 8);
      this.researcherId = +(p.substring(0, p.indexOf("/")));
      this.sessionService.getUserById(this.researcherId).subscribe((res) =>{
        let usr = res as User;
        this.setFullName(usr);
      });
    }
   } else {
    let idx = url.indexOf("/p/"); 
    if (idx > 0) {
      let p = url.substring(idx + 3);
      var researcher = p.substring(0, p.indexOf("/"));
      this.prefix = "/p/" + researcher;
      this.sessionService.getUserByEmail(researcher).subscribe(res => {
        let usr = res as User;
        this.setFullName(usr);
        this.webGenService.getBannerContent(usr.email).subscribe(res => {
          if (res)
            this.customBanner = res;
        })
      });
    }
   }
   this.activeSection = url.substr(url.lastIndexOf("/") + 1);
  }

  setFullName(usr: User) {
    this.fullResearcherName = this.eNull(usr.prefijo)+" "+this.eNull(usr.nombres)+" "+this.eNull(usr.apellidoPaterno)+" "+this.eNull(usr.apellidoMaterno);
  }

  eNull(s:string): string {
    return s || "";
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

  gotoSection(sectionName:string) {
    let url = this.prefix + '/' + sectionName;
    this.router.navigate([url]);
    this.activeSection = sectionName;
  }

}
