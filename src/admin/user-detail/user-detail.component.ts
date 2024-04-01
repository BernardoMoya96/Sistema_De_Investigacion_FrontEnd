import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LookupService } from 'src/app/lookup.service';
import { AppModalService } from 'src/app/modals/app-modal.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserDetailComponent implements OnInit {

  constructor(private adminService: AdminService, private lookupService:LookupService, 
    private confirmationModal : AppModalService, private route: ActivatedRoute, 
    private router:Router, private cd: ChangeDetectorRef) { }

  userFB: FormGroup = new FormGroup({});
  mode:string | undefined;
  fileStr:string | ArrayBuffer| null = null;

  tiposUsuario: Array<any>  = [];
  decanatos: Array<any> = [];
  departamentos: Array<any>  = [];
  facultades: Array<any> = [];


  payloadFields:Array<string> = this.getArrayOfFields();


  ngOnInit(): void {
    this.mode = this.route.snapshot.paramMap.get("mode") || 'add';
    this.initEmptyFormGroup();
    this.lookupService.lookupDecanatos().subscribe(data => {
      this.decanatos = data as Array<any>;
      console.log("decanatos ", this.decanatos)
    });
    this.lookupService.lookupTiposDeUsuario().subscribe(data => {
      this.tiposUsuario = data as Array<any>;
      console.log("tipos de usuario", this.tiposUsuario)
    });
    if  (this.mode == 'update') {
      var userId = this.route.snapshot.paramMap.get("userId") || 0;
      if (userId > 0) {
        this.initFormGroupFromUser(+userId); 
      }
    }
    this.suscribeToDropdownChanges();
  }


  initFormGroupFromUser(userId: number) {
    this.adminService.getUserById(userId).subscribe((res:any) => {
      Object.keys(res).forEach(key => {
        if (key != 'img') {
          var value = res[key];
          var ctrl = this.userFB.controls[key] || null;
          if (key != 'password') {
            if (ctrl) {
              if (key == 'roles') {
                let arr = [];
                for (let r of value) {
                  arr.push(""+r);
                }
                ctrl.setValue(arr);
              }
              else 
                ctrl.setValue(value);
            }
          }
          // remove validators
          if (ctrl) {
            ctrl.setValidators(null);
            ctrl.setErrors(null);
          }
        }
      });
      this.cd.detectChanges();
    });
  }

  suscribeToDropdownChanges() {
    var decanatoDropdown = this.userFB.get("decanatoId");
    decanatoDropdown?.valueChanges.subscribe(selectedDecanato => {
      this.getFacultades(selectedDecanato);
      this.userFB.get("departamentoId")?.setValue("");
    });
    var facultadDropdown = this.userFB.get("facultadId");
    facultadDropdown?.valueChanges.subscribe(selectedFacultad => {
      this.getDepartamentos(selectedFacultad);
    });
  }


  getDepartamentos(selectedFacultad: number) {
    this.lookupService.lookupDepartamentos(selectedFacultad).subscribe(data => {
      this.departamentos = data as Array<any>;
      console.log("departamentos", this.departamentos)
      var ctrl = this.userFB.get("departamentoId");
      if (this.departamentos.length == 0 ) {
        ctrl?.setValidators(null);
        ctrl?.setErrors(null);
      } else if (!ctrl?.value){
        ctrl?.setValidators(Validators.required);
        ctrl?.setErrors({required:true});
      }
      console.log("control departamento", this.userFB.get("departamentoId"))
    })
  }

  getFacultades(decanatoId:number) {
    this.lookupService.lookupFacultad(decanatoId).subscribe(data => {
      this.facultades = data as Array<any>;
      console.log("facultades", this.facultades)
      var ctrl = this.userFB.get("facultadId");
      if (this.facultades.length == 0 ) {
        ctrl?.setValidators(null);
        ctrl?.setErrors(null);
        var dpto = this.userFB.get("departamentoId");
        dpto?.setValidators(null);
        dpto?.setErrors(null);
        dpto?.setValue("");
      } else  if (!ctrl?.value){
        ctrl?.setValidators(Validators.required);
        ctrl?.setErrors({required:true});
      }
    })
  }

  getArrayOfFields():Array<string> {
    return ['id','prefijo','nombres','apellidoPaterno','apellidoMaterno','roles','decanatoId','facultadId','departamentoId',
        'email','password','comentarios','ubicacion'];
  }

  initEmptyFormGroup() {
    let fcArray:any = {};
    for (let _key of this.payloadFields) {
      var fc;
      if (_key == 'email')
        fc = new FormControl('',[Validators.required, Validators.email]);
      else if (_key == 'comentarios')
        fc = new FormControl('');
      else if (_key == 'roles') 
        fc = new FormControl([], Validators.required)
      else
        fc = new FormControl('',Validators.required);
      fcArray[_key] = fc;
    }
    this.userFB = new FormGroup(fcArray);
  }

  handleFileChange(event:any) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.fileStr = reader.result;
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  submitForm() {
    var payload:any = {};
    Object.keys(this.userFB.controls).forEach(key => {
      var value = this.userFB.controls[key].value;
      payload[key] = value;
    });
    if (this.fileStr) {
      payload['img'] = this.fileStr;
    }
    console.log("payload is", payload)
    if (this.mode == 'add') {
      this.adminService.saveUser(payload).subscribe((res) => {
        this.confirmationModal.ack("Operación Exitosa", res);
        this.router.navigate(['/admin']);
      });
    } else {
      this.adminService.updateUser(payload).subscribe((res) => {
        this.confirmationModal.ack("Operación Exitosa", res);
        this.router.navigate(['/admin']);
      });
    }
  }

  get $fb() {
    return this.userFB.controls;
  }

}
