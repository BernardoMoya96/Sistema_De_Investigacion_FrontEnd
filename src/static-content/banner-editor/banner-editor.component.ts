import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppModalService } from 'src/app/modals/app-modal.service';
import { StaticContentService } from '../static-content.service';

@Component({
  selector: 'app-banner-editor',
  templateUrl: './banner-editor.component.html',
  styleUrls: ['./banner-editor.component.css']
})
export class BannerEditorComponent implements OnInit {

  researcherId:number | null | undefined;
  arrStr: Array<any> = [];
  charCount:number = 0;
  logo:any = {};
  logoTouched:boolean = false;
  showAddLogoSection:boolean = true;
  charLimit:number = 150;
  charTextRowsLimit:number = 5;

  constructor(private staticContentService: StaticContentService, private route:ActivatedRoute, 
    private modalService: AppModalService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {  
    this.route.params.subscribe(routeParams => {
      this.researcherId = routeParams.researcher;
      this.initBanner();
    })  
  }

  initBanner() {
    this.staticContentService.getBannerContent(this.researcherId!).subscribe((res:any) => {
      console.log("response is", res)
      this.charCount = 0;
      this.logo = res['logo'] ? res['logo'] : null;
      console.log("logo is", this.logo)
      this.showAddLogoSection = this.logo !=  null;
      console.log("show logo section", this.showAddLogoSection)
      let arr = res['items'] as Array<any>;
      this.arrStr = [];
      for (let itm of arr) {
        this.charCount += itm.texto.length;
        let obj = itm;
        itm.readonly = false;
        this.arrStr.push(obj);
      }
      if (this.charCount >= this.charLimit) {
        for (let itm of this.arrStr) {
          itm.readonly = true;
        }
      }
    });
  }

  handleFileChange(event:any) {
    let me = this;
    let file = event.target.files[0];
    let fileName = file.name;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.logo = {nombre:fileName,img:reader.result};
      me.logoTouched = true;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  public addLogo() {
    this.logoTouched = true;
    this.showAddLogoSection = true;
  }

  removeLogo() {
    this.logoTouched = true;
    this.showAddLogoSection = false;
    this.logo = null;
  }

  addText() {
    if (this.arrStr.length < this.charTextRowsLimit)
    this.arrStr.push({"id":0,"texto":"","readonly":false})
  }

  removeText(idx:number) {
    if (this.arrStr[idx]) {
      this.arrStr.splice(idx,1);
    }    
  }

  handleTextChange($event:any, idx:number) {
    let value = $event.target.value;
    if (this.arrStr[idx]) {
      this.charCount -= this.arrStr[idx].texto.length;
      this.arrStr[idx].texto = value;
      this.charCount += this.arrStr[idx].texto.length;
    }
    if (this.charCount >= this.charLimit) {
      for (let i = 0; i < this.arrStr.length; i++) {
        if (i != idx) {
          this.arrStr[i]['readonly'] = true;
        }
      }
    } else {
      for (let i = 0; i < this.arrStr.length; i++) {
        this.arrStr[i]['readonly'] = false;
      }
    }
    this.cd.detectChanges();
  }

  saveBanner() {
    // validate
    if (this.charCount >= this.charLimit) {
      return alert("Por favor elimina algunos caracteres." +
       "El límite permitido es " + this.charLimit+" y se encontraron " + this.charCount + " caracteres");
    }
    if (this.logoTouched) {
      this.logo['investigadorId'] = this.researcherId;
      this.staticContentService.mergeLogo(this.logo).subscribe(res => {
        console.log("response of updating logo", res)
      });
    }
    this.staticContentService.mergeBannerText(this.researcherId!,this.arrStr).subscribe(res => {
      this.modalService.ack("Operación Exitosa", res);
    });
  }
  

}
