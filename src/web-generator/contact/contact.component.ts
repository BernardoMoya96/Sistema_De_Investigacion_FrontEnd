import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppModalService } from 'src/app/modals/app-modal.service';
import { StaticContentService } from 'src/static-content/static-content.service';
import { WebGeneratorService } from '../web-generator.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  researcher:string | undefined;
  content:any;
  sectionId:number | null | undefined;
  showError:boolean = false;

  constructor(private route: ActivatedRoute, private webService: WebGeneratorService, private contentService: StaticContentService, private modalService: AppModalService) { }

  ngOnInit(): void {
    this.route.params.subscribe(paramPath => {
      this.researcher = paramPath.researcher; 
      this.fetchContent();
    })  
  }

  ubicacion:string ="";
  fullName:string = "";
  departamento:string = "";
  decanato:string="";
  email:string="";

  fetchContent() {
    this.initEmptyFormGroup();
    // fetch left side contect (image most likely)
    this.contentService.getSectionIdByName("contacto").subscribe(res => {
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
    // fetch researcher info
    this.webService.getResearcherInfo(this.researcher!).subscribe((res:any) => {
      this.ubicacion = this.eNull(res.ubicacion);
      this.fullName = this.eNull(res.nombres)+" "+this.eNull(res.apellidoPaterno)+" "+this.eNull(res.apellidoMaterno);
      this.departamento = this.eNull(res.departamento);
      this.decanato = this.eNull(res.decanato);
      this.email = this.eNull(res.email);
    });
  }

  private eNull(val:any) {
    if (val)
      return val;
    return "";
  }

  contactFB: FormGroup = new FormGroup({});

  getArrayOfFields():Array<string> {
    return ['contactNombre','contactCorreo','contactAsunto','contactMensaje'];
  }

  initEmptyFormGroup() {
    let fcArray:any = {};
    for (let _key of this.getArrayOfFields()) {
      var fc;
      if (_key == 'contactCorreo')
        fc = new FormControl('',[Validators.required, Validators.email]);
      else
        fc = new FormControl('',Validators.required);
      fcArray[_key] = fc;
    }
    this.contactFB = new FormGroup(fcArray);
  }

  public sendEmail() {
    let payload = this.contactFB.getRawValue();
    payload['emailInvestigador'] = this.researcher+'@edu.uag.mx'
    console.log("payload to send to back",payload );
    this.webService.sendEmail(payload).subscribe(res =>{
      this.modalService.ack("Mensaje", res);
      this.contactFB.reset();
    });
  }


  get $fb() {
    return this.contactFB.controls;
  }

}
