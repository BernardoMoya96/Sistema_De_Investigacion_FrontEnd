import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/admin/admin.service';
import { LookupService } from 'src/app/lookup.service';
import { AppModalService } from 'src/app/modals/app-modal.service';
import { InvestigadorService } from '../investigador.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-investigador-listing',
  templateUrl: './investigador-listing.component.html',
  styleUrls: ['./investigador-listing.component.css']
})
export class InvestigadorListingComponent implements OnInit {
  
  
  listData: any;  
  usuarios: Array<any> = [];  
  alumnos: Array<any> = [];
  externos: Array<any> = [];
  investigadores: Array<any> = [];
  estadoLookup: Array<any> = [];
  decanatos: Array<any> = [];
  campoConocimiento: Array<any> = [];
  disciplinas: Array<any> = [];
  subdisciplinas: Array<any> = [];
  categoriaInvestigacion : Array<any> = [];
  tipoInvestigacion: Array<any> = [];
  grado: Array<any> = [];
  // proyectoForm: FormGroup = new FormGroup({});
  proyectoForm!: FormGroup;
  userForm!: FormGroup;
  mode:string | undefined;
  fileStr:string | ArrayBuffer| null = null;
  tiposUsuario: Array<any>  = [];  
  facultades: Array<any> = [];
  departamentos: Array<any>  = [];
    

  constructor(private adminService: AdminService, private proyectoService: InvestigadorService,private lookupService:LookupService, 
    private confirmationModal : AppModalService, private route: ActivatedRoute, private router:Router, private fb:FormBuilder, private modalService: NgbModal) {      
      this.listData = [];       
      this.estadoLookup = [];    
      this.decanatos = [];       
      // return ['nombre','titulo','fechaRegistro','fechaInicio','fechaFin','resumen','decanatoId','userId','objetivos','programaIdPrograma','estadoLookupEstadoCodigo'];
      this.proyectoForm = this.fb.group({
        idProyecto: ['',Validators.required],
        titulo: ['',Validators.required],
        fechaRegistro: ['',Validators.required],
        decanatoId: ['',Validators.required],        
        departamentoId: ['',Validators.required],        
        facultadId: ['',Validators.required],        
        campoConocimientoId: ['',Validators.required],
        categoriaInvestigacion: ['',Validators.required],
        tipoInvestigacion: ['',Validators.required],
        grado: ['',Validators.required],        
        disciplinaId: ['',Validators.required],      
        subdisciplinaId: ['',Validators.required],        
        estadoLookup: ['',Validators.required],
        beneficiario: ['',Validators.required],
        fechaInicio: ['',Validators.required],
        fechaTermino: ['',Validators.required],
        duracionEstimada: ['',Validators.required]        
      });
    }  

    
  participantes() : FormArray {
    return this.userForm.get("quantities") as FormArray
  }

  // newParticipante(): FormGroup {
  //   return this.fb.group({
  //     nomina: '', 
  //     nombre: '',
  //     participacion: '',
  //     horas: ''      
  //   })
  // }

  // addParticipante(){
  //   this.participantes().push(this.newParticipante());
  // }

  // removeParticipante(i:number) {
  //   this.participantes().removeAt(i);
  // }
   
   
  onSubmit() {    
    let nomina : number;    
    let nombre;
    let datos; 
    let ordenar_nombre;   
        
    // this.listData.push(this.userForm.value);

    interface CamposTabla {
      nomina: string;
      nombre: string; 
    }
    
    this.modalService.dismissAll();    
    // console.log(this.userForm.value.participantes);        
    // nombre = this.userForm.value.participantes;    
    // nombre.toString();
    // const myArray = nombre.split("-");    
    // this.listData.push(myArray[0]);
    // this.listData.push(myArray[1]);        
    datos = this.userForm.value.participantes;
    datos.toString();
    const myArray = datos.split(" - ");    
    nombre = myArray[1];
    const splitNombre = nombre.split(" ");
    ordenar_nombre = splitNombre[1] + " " + splitNombre[2] + ", " + splitNombre[0];      
    
    

    const obj1: CamposTabla = {
      nomina: myArray[0],
      nombre:  ordenar_nombre.toUpperCase()
    };
    
  this.listData.push(obj1);

    console.log(this.listData);
    // console.log(ordenar_nombre);
    
  }

  // payloadFields:Array<string> = this.getArrayOfFields();

  public addItem(): void{    
    this.listData.push(this.proyectoForm.value);
    this.proyectoForm.reset();
  }
  reset(){
    this.proyectoForm.reset();
  }
  removeItem(element: any){
    this.listData.forEach((value: any, index: any)=>{
      if(value == element){ 
        this.listData.splice(index,1);
      }
    })
  }

  ngOnInit(): void {
    this.mode = this.route.snapshot.paramMap.get("mode") || 'add';
    // this.initEmptyFormGroup();    
    this.lookupService.lookupDecanatos().subscribe(data => {
      this.decanatos = data as Array<any>;
      console.log("decanatos ", this.decanatos)
    });    
    this.lookupService.lookupCamposConocimiento().subscribe(data =>{
      this.campoConocimiento = data as Array<any>;      
    })
    this.lookupService.lookUpCategoriaInvestigacion().subscribe(data =>{
      this.categoriaInvestigacion = data as Array<any>;      
    })
    this.lookupService.lookUpTipoInvestigacion().subscribe(data=>{
      this.tipoInvestigacion = data as Array<any>;
    })    
    this.lookupService.lookUpGrado().subscribe(data=>{
      this.grado = data as Array<any>;
    })
    this.lookupService.lookUpEstados().subscribe(data =>{
      this.estadoLookup = data as Array<any>;
      console.log("Estado Proyecto: ", this.estadoLookup)
    });    
    /*this.adminService.fetchAllUsers().then(data =>{
      this.usuarios = data as Array<any>;
      console.log("Usuarios: ",this.usuarios);
    })*/
    this.adminService.fetchAllColaboradores().then(data =>{
      this.externos = data as Array<any>;    
    })
    this.adminService.fetchAllInvestigadores().then(data =>{
      this.investigadores = data as Array<any>;
    })
    this.adminService.fetchAllStudents().then(data=>{
      this.alumnos= data as Array<any>;
    })
    if  (this.mode == 'update') {
      var proyectoId = this.route.snapshot.paramMap.get("proyectoId") || 0;
      if (proyectoId > 0) {
        this.initFormGroupFromProyecto(+proyectoId); 
      }
    }
    this.suscribeToDropdownChanges();
  }

  suscribeToDropdownChanges() {
    var decanatoDropdown = this.proyectoForm.get("decanatoId");
    decanatoDropdown?.valueChanges.subscribe(selectedDecanato => {
      this.getFacultades(selectedDecanato);
      this.proyectoForm.get("departamentoId")?.setValue("");
    });
    var facultadDropdown = this.proyectoForm.get("facultadId");
    facultadDropdown?.valueChanges.subscribe(selectedFacultad => {
      this.getDepartamentos(selectedFacultad);
    });

    var campoConocimientoDropdown = this.proyectoForm.get("campoConocimientoId");
    campoConocimientoDropdown?.valueChanges.subscribe(selectedCampoConocimiento => {
      this.getDisciplinas(selectedCampoConocimiento);
      //this.proyectoForm.get("subdisciplinaId")?.setValue("");
    });
    var disciplinaDropdown= this.proyectoForm.get("disciplinaId");
    disciplinaDropdown?.valueChanges.subscribe(selectedDisciplina =>{
      this.getSubdisciplinas(selectedDisciplina);
    })
  }

  getDepartamentos(selectedFacultad: number) {
    this.lookupService.lookupDepartamentos(selectedFacultad).subscribe(data => {
      this.departamentos = data as Array<any>;
      console.log("departamentos", this.departamentos)
      var ctrl = this.proyectoForm.get("departamentoId");
      if (this.departamentos.length == 0 ) {
        ctrl?.setValidators(null);
        ctrl?.setErrors(null);
      } else if (!ctrl?.value){
        ctrl?.setValidators(Validators.required);
        ctrl?.setErrors({required:true});
      }
      console.log("control departamento", this.proyectoForm.get("departamentoId"))
    })
  }
  getFacultades(decanatoId:number) {
    this.lookupService.lookupFacultad(decanatoId).subscribe(data => {
      this.facultades = data as Array<any>;
      console.log("facultades", this.facultades)
      var ctrl = this.proyectoForm.get("facultadId");
      if (this.facultades.length == 0 ) {
        ctrl?.setValidators(null);
        ctrl?.setErrors(null);
        var dpto = this.proyectoForm.get("departamentoId");
        dpto?.setValidators(null);
        dpto?.setErrors(null);
        dpto?.setValue("");
      } else  if (!ctrl?.value){
        ctrl?.setValidators(Validators.required);
        ctrl?.setErrors({required:true});
      }
    })
  }

  getDisciplinas(campoConocimientoId:number){
    this.lookupService.lookupDiciplinaDeCampo(campoConocimientoId).subscribe(data=>{
      this.disciplinas = data as Array<any>;      
      var ctrl = this.proyectoForm.get("disciplinaId");
      if(this.disciplinas.length==0){
        ctrl?.setValidators(null);
        ctrl?.setErrors(null);
        var sub = this.proyectoForm.get("subdisciplinaId");
        sub?.setValidators(null);
        sub?.setErrors(null);
        sub?.setValue("");
      }else if(!ctrl?.value){
        ctrl?.setValidators(Validators.required);
        ctrl?.setErrors({required:true});
      }
    })
  }

  getSubdisciplinas(disciplinaId:number){
    this.lookupService.lookupSubDisciplinaDeDisciplina(disciplinaId).subscribe(data=>{
      this.subdisciplinas = data as Array<any>;      
      var ctrl = this.proyectoForm.get("subdisciplinaId");
      if(this.subdisciplinas.length==0){
        ctrl?.setValidators(null);
        ctrl?.setErrors(null);                
      }else if(!ctrl?.value){
        ctrl?.setValidators(Validators.required);
        ctrl?.setErrors({required:true});
      }
    })
  }

  addUser(): void{    
    // let id : number;
    // let userId: string;
    // let nombre: string;
    // let titulo: string;
    // let usuario: string;
    // id = this.userForm.value.userId;
    
    // // this.adminService.getUserById(id).subscribe((res:any) =>{        
    // // console.log(res);    
    // //   this.listData.push(res);   
    // //   console.log(this.listData);
    // // });
    console.log(JSON.stringify(this.proyectoForm.value));
    // this.listData.push(this.userForm.value);
    // this.userForm.reset();
  }
  
  initFormGroupFromProyecto(proyectoId: number) {
    this.proyectoService.getProyectoById(proyectoId).subscribe((res:any) => {
      Object.keys(res).forEach(key => {     
        var value = res[key];
        console.log(value);
        var ctrl = this.proyectoForm.controls[key] || null;
        ctrl.setValue(value);                          
      });
    });
  }


  // getArrayOfFields():Array<string> {
  //   return ['nombre','titulo','fechaRegistro','fechaInicio','fechaFin','resumen','decanatoId','userId','objetivos','programaIdPrograma','estadoLookupEstadoCodigo'];
  // }

  // initEmptyFormGroup() {
  //   let fcArray:any = {};
  //   for (let _key of this.payloadFields) {
  //     var fc;
  //     if (_key == 'email')
  //       fc = new FormControl('',[Validators.required, Validators.email]);
  //     else if (_key == 'comentarios')
  //       fc = new FormControl('');
  //     else if (_key == 'roles') 
  //       fc = new FormControl([], Validators.required)
  //     else
  //       fc = new FormControl('',Validators.required);
  //     fcArray[_key] = fc;
  //   }
  //   this.proyectoForm = new FormGroup(fcArray);
  // }


  submitForm() {
    var payload:any = {};
    Object.keys(this.proyectoForm.controls).forEach(key => {
      var value = this.proyectoForm.controls[key].value;
      payload[key] = value;
    }); 
    if (this.mode == 'add') {
      this.proyectoService.saveProyecto(payload).subscribe((res) => {
        this.confirmationModal.ack("Operación Exitosa", res);
        this.router.navigate(['/investigador']);
      });
    } else {
      this.proyectoService.updateProyecto(payload).subscribe((res) => {
        this.confirmationModal.ack("Operación Exitosa", res);
        this.router.navigate(['/investigador']);
      });
    }
  }

  get $fb() {
    return this.proyectoForm.controls;
  }
   
    
  open(content:any) {
    this.modalService.open(content);    
  }     
}
