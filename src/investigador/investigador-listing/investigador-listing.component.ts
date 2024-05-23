import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/admin/admin.service';
import { LookupService } from 'src/app/lookup.service';
import { AppModalService } from 'src/app/modals/app-modal.service';
import { InvestigadorService } from '../investigador.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from 'src/app/security/session.service';

@Component({
  selector: 'app-investigador-listing',
  templateUrl: './investigador-listing.component.html',
  styleUrls: ['./investigador-listing.component.css']
})
export class InvestigadorListingComponent implements OnInit {
  
  listColaboradores: any;
  listAlumnos: any;
  listInvestigadores: any;
  listData: any;  
  usuarios: Array<any> = [];  
  alumn: Array<any> = [];
  colab: Array<any> = [];
  invest: Array<any> = [];
  estadoLookup: Array<any> = [];
  decanatos: Array<any> = [];
  campoConocimiento: Array<any> = [];
  disciplinas: Array<any> = [];
  subdisciplinas: Array<any> = [];
  lineasInvestigacion: Array<any> = [];
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
  fuenteFinanciamientos: Array<any> = [];
  userName: string = "";
    

  constructor(private sessionService: SessionService, private adminService: AdminService, private proyectoService: InvestigadorService, private lookupService: LookupService,
    private confirmationModal: AppModalService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private modalService: NgbModal, private formBuilder: FormBuilder) {
      this.listColaboradores = [];
      this.listAlumnos = [];
      this.listInvestigadores = [];
      this.estadoLookup = [];
      this.decanatos = [];
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
        descripcion: ['', Validators.required],
        objetivos: ['', Validators.required],
        resultados: ['', Validators.required],
        fuenteFinanciamiento: ['', Validators.required],
        disciplinaId: ['',Validators.required],      
        subdisciplinaId: ['',Validators.required],   
        lineasInvestigacionId: ['', Validators.required],     
        estadoLookup: ['',Validators.required],
        productoGenerado: ['', Validators.required],
        beneficiario: ['',Validators.required],
        fechaInicio: ['',Validators.required],
        fechaTermino: ['',Validators.required],
        duracionEstimada: ['',Validators.required],
        colaboradores: this.fb.array([]),
        alumnos: this.fb.array([]),
        investigadoresExternos: this.fb.array([])        
      });
      this.userForm = this.formBuilder.group({
        colaboradores: [''],
        alumnos: [''],
        investigadores: ['']
      });
    }  

  get colaboradores(): FormArray {
    return this.proyectoForm.get('colaboradores') as FormArray;
  }

  get alumnos(): FormArray {
    return this.proyectoForm.get('alumnos') as FormArray;
  }

  get investigadoresExternos(): FormArray {
    return this.proyectoForm.get('investigadoresExternos') as FormArray;
  }
   
   
  onSubmit(userType: string) {

    const colaboradorFormGroup = this.fb.group({
      nomina: [''],
      nombre: [''],
      participacion: [''],
      horas: ['']
    });

    const alumnoFormGroup = this.fb.group({
      nomina: [''],
      nombre: [''],
      participacion: [''],
      horas: ['']
    });

    const investigadorFormGroup = this.fb.group({
      nomina: [''],
      nombre: [''],
      participacion: [''],
      horas: ['']
    });

    interface CamposTabla {
      nomina: string;
      nombre: string;
    }

    let nombre;
    let datos;
    let ordenar_nombre;
    let myArray;
    let splitNombre;

    this.modalService.dismissAll();

    switch (userType) {
      case 'colaborador':
        console.log('Agregar colaborador:', this.userForm.value.colaboradores);
        datos = this.userForm.value.colaboradores;
        myArray = datos.split(" - ");
        nombre = myArray[1];
        splitNombre = nombre.split(" ");
        ordenar_nombre = splitNombre[1] + " " + splitNombre[2] + ", " + splitNombre[0];
        const obj1: CamposTabla = {
          nomina: myArray[0],
          nombre: ordenar_nombre.toUpperCase()
        };
        this.listColaboradores.push(obj1);
        colaboradorFormGroup.get('nomina')?.setValue(obj1.nomina);
        colaboradorFormGroup.get('nombre')?.setValue(obj1.nombre);
        console.log('Valor de nomina:', colaboradorFormGroup.get('nomina')?.value);
        console.log('Valor de nombre:', colaboradorFormGroup.get('nombre')?.value);
        (this.proyectoForm.get('colaboradores') as FormArray).push(colaboradorFormGroup);
        break;

      case 'alumno':
        console.log('Agregar alumno:', this.userForm.value.alumnos);
        datos = this.userForm.value.alumnos;
        myArray = datos.split(" - ");
        nombre = myArray[1];
        splitNombre = nombre.split(" ");
        ordenar_nombre = splitNombre[1] + " " + splitNombre[2] + ", " + splitNombre[0];
        const obj2: CamposTabla = {
          nomina: myArray[0],
          nombre: ordenar_nombre.toUpperCase()
        };
        this.listAlumnos.push(obj2);
        alumnoFormGroup.get('nomina')?.setValue(obj2.nomina);
        alumnoFormGroup.get('nombre')?.setValue(obj2.nombre);
        console.log('Valor de nomina:', alumnoFormGroup.get('nomina')?.value);
        console.log('Valor de nombre:', alumnoFormGroup.get('nombre')?.value);
        (this.proyectoForm.get('alumnos') as FormArray).push(alumnoFormGroup);
        break;

      case 'externo':
        console.log('Agregar externo:', this.userForm.value.investigadores);
        datos = this.userForm.value.investigadores;
        myArray = datos.split(" - ");
        nombre = myArray[1];
        splitNombre = nombre.split(" ");
        ordenar_nombre = splitNombre[1] + " " + splitNombre[2] + ", " + splitNombre[0];
        const obj3: CamposTabla = {
          nomina: myArray[0],
          nombre: ordenar_nombre.toUpperCase()
        };
        this.listInvestigadores.push(obj3);
        investigadorFormGroup.get('nomina')?.setValue(obj3.nomina);
        investigadorFormGroup.get('nombre')?.setValue(obj3.nombre);
        console.log('Valor de nomina:', investigadorFormGroup.get('nomina')?.value);
        console.log('Valor de nombre:', investigadorFormGroup.get('nombre')?.value);
        (this.proyectoForm.get('investigadoresExternos') as FormArray).push(investigadorFormGroup);
        break;

      default:
        // Manejar caso por defecto o error
        break;
    }

  }

  // payloadFields:Array<string> = this.getArrayOfFields();

  reset(){
    this.proyectoForm.reset();
  }

  ngOnInit(): void {
    var user = this.sessionService.getUserSession();
    if (user) {
      this.userName = user.nombres + " " + user.apellidoPaterno + user.apellidoMaterno;
    }
    this.mode = this.route.snapshot.paramMap.get("mode") || 'add';
    // this.initEmptyFormGroup();    
    this.lookupService.lookupDecanatos().subscribe(data => {
      this.decanatos = data as Array<any>;
      //console.log("decanatos ", this.decanatos)
    });
    this.lookupService.lookupCamposConocimiento().subscribe(data => {
      this.campoConocimiento = data as Array<any>;
    })
    this.lookupService.lookUpCategoriaInvestigacion().subscribe(data => {
      this.categoriaInvestigacion = data as Array<any>;
    })
    this.lookupService.lookUpTipoInvestigacion().subscribe(data => {
      this.tipoInvestigacion = data as Array<any>;
    })
    this.lookupService.lookUpGrado().subscribe(data => {
      this.grado = data as Array<any>;
    })
    this.lookupService.lookUpEstados().subscribe(data => {
      this.estadoLookup = data as Array<any>;
      //console.log("Estado Proyecto: ", this.estadoLookup)
    });
    this.lookupService.lookUpCategoriaInvestigacion().subscribe(data => {
      this.categoriaInvestigacion = data as Array<any>;
    })
    /*this.adminService.fetchAllUsers().then(data =>{
      this.usuarios = data as Array<any>;
      console.log("Usuarios: ",this.usuarios);
    })*/
    this.adminService.fetchAllColaboradores().then(data => {
      this.colab = data as Array<any>;
      this.colab.forEach(colaborador => {
        console.log("Colaboradores: " + `ID: ${colaborador.id}, Nombre: ${colaborador.nombres} ${colaborador.apellidoPaterno} ${colaborador.apellidoMaterno}`);
      });
    })
    this.adminService.fetchAllInvestigadores().then(data => {
      this.invest = data as Array<any>;
      this.invest.forEach(investigador => {
        console.log("Investigadores: " + `ID: ${investigador.id}, Nombre: ${investigador.nombres} ${investigador.apellidoPaterno} ${investigador.apellidoMaterno}`);
      });
    })
    this.adminService.fetchAllStudents().then(data => {
      this.alumn = data as Array<any>;
      this.alumn.forEach(alumno => {
        console.log("Alumnos: " + `ID: ${alumno.id}, Nombre: ${alumno.nombres} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`);
      });
    })
    this.lookupService.lookupFinanciamiento().then(data => {
      this.fuenteFinanciamientos = data as Array<any>;
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
    var disciplinaDropdown = this.proyectoForm.get("disciplinaId");
    disciplinaDropdown?.valueChanges.subscribe(selectedDisciplina => {
      this.getSubdisciplinas(selectedDisciplina);
    })
    var subdisciplinaDropdown = this.proyectoForm.get("subdisciplinaId");
    subdisciplinaDropdown?.valueChanges.subscribe(selectedSubdisciplina => {
      this.getLineasInvestigacion(selectedSubdisciplina);
    });
  }

  getDepartamentos(selectedFacultad: number) {
    this.lookupService.lookupDepartamentos(selectedFacultad).subscribe(data => {
      this.departamentos = data as Array<any>;
      console.log("departamentos", this.departamentos)
      var ctrl = this.proyectoForm.get("departamentoId");
      if (this.departamentos.length == 0) {
        ctrl?.setValidators(null);
        ctrl?.setErrors(null);
      } else if (!ctrl?.value) {
        ctrl?.setValidators(Validators.required);
        ctrl?.setErrors({ required: true });
      }
      console.log("control departamento", this.proyectoForm.get("departamentoId"))
    })
  }
  getFacultades(decanatoId: number) {
    this.lookupService.lookupFacultad(decanatoId).subscribe(data => {
      this.facultades = data as Array<any>;
      console.log("facultades", this.facultades)
      var ctrl = this.proyectoForm.get("facultadId");
      if (this.facultades.length == 0) {
        ctrl?.setValidators(null);
        ctrl?.setErrors(null);
        var dpto = this.proyectoForm.get("departamentoId");
        dpto?.setValidators(null);
        dpto?.setErrors(null);
        dpto?.setValue("");
      } else if (!ctrl?.value) {
        ctrl?.setValidators(Validators.required);
        ctrl?.setErrors({ required: true });
      }
    })
  }

  getDisciplinas(campoConocimientoId: number) {
    this.lookupService.lookupDiciplinaDeCampo(campoConocimientoId).subscribe(data => {
      this.disciplinas = data as Array<any>;
      var ctrl = this.proyectoForm.get("disciplinaId");
      if (this.disciplinas.length == 0) {
        ctrl?.setValidators(null);
        ctrl?.setErrors(null);
        var sub = this.proyectoForm.get("subdisciplinaId");
        sub?.setValidators(null);
        sub?.setErrors(null);
        sub?.setValue("");
      } else if (!ctrl?.value) {
        ctrl?.setValidators(Validators.required);
        ctrl?.setErrors({ required: true });
      }
    })
  }

  getSubdisciplinas(disciplinaId: number) {
    this.lookupService.lookupSubDisciplinaDeDisciplina(disciplinaId).subscribe(data => {
      this.subdisciplinas = data as Array<any>;
      var ctrl = this.proyectoForm.get("subdisciplinaId");
      if (this.subdisciplinas.length == 0) {
        ctrl?.setValidators(null);
        ctrl?.setErrors(null);
        var sub = this.proyectoForm.get("lineasInvestigacionId");
        sub?.setValidators(null);
        sub?.setErrors(null);
        sub?.setValue("");
      } else if (!ctrl?.value) {
        ctrl?.setValidators(Validators.required);
        ctrl?.setErrors({ required: true });
      }
    })
  }


  getLineasInvestigacion(subdisciplinaId: number) {
    this.lookupService.lookupLineaInvestigacion(subdisciplinaId).subscribe(data => {
      this.lineasInvestigacion = data as Array<any>;
      var ctrl = this.proyectoForm.get("lineasInvestigacionId");
      if (this.lineasInvestigacion.length == 0) {
        ctrl?.setValidators(null);
        ctrl?.setErrors(null);
      } else if (!ctrl?.value) {
        ctrl?.setValidators(Validators.required);
        ctrl?.setErrors({ required: true });
      }
    })
  }
  addUser(): void {
    console.log(JSON.stringify(this.proyectoForm.value));
  }
  
  initFormGroupFromProyecto(proyectoId: number) {
    this.proyectoService.getProyectoById(proyectoId).subscribe((res: any) => {
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
    var payload: any = {};
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

  deleteRow(index: number, listName: string): void {
    switch (listName) {
      case 'colaboradores':
        const colaboradoresArray = this.proyectoForm.get('colaboradores') as FormArray;
        colaboradoresArray.removeAt(index);
        break;
      case 'alumnos':
        const alumnosArray = this.proyectoForm.get('alumnos') as FormArray;
        alumnosArray.removeAt(index);        
        break;
      case 'investigadores':
        const investigadoresArray = this.proyectoForm.get('investigadoresExternos') as FormArray;
        investigadoresArray.removeAt(index);      
        break;
      default:
        console.error('Lista no encontrada');
    }
  }

  registrarProyecto() {
    // Aquí capturas los datos del formulario y los muestras en la consola
    console.log('Datos del Formulario:', this.proyectoForm.value);
  }
}
