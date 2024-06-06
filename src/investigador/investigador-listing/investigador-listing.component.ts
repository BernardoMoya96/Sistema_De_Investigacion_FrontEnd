import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/admin/admin.service';
import { LookupService } from 'src/app/lookup.service';
import { AppModalService } from 'src/app/modals/app-modal.service';
import { InvestigadorService } from '../investigador.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from 'src/app/security/session.service';
import { HttpClient } from '@angular/common/http';

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
  selectedImage: File | null = null;
    

  constructor(private sessionService: SessionService, private adminService: AdminService, private proyectoService: InvestigadorService, private lookupService: LookupService,
    private confirmationModal: AppModalService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private modalService: NgbModal, private formBuilder: FormBuilder, private http: HttpClient) {
      this.listColaboradores = [];
      this.listAlumnos = [];
      this.listInvestigadores = [];
      this.estadoLookup = [];
      this.decanatos = [];
      this.listData = [];       
      this.estadoLookup = [];    
      this.decanatos = [];       
      // return ['nombre','titulo','fechaRegistro','fechaInicio','fechaFin','resumen','idDecanato','userId','objetivos','programaIdPrograma','estadoLookupEstadoCodigo'];
      this.proyectoForm = this.fb.group({
        idProyecto: ['',Validators.required],
        nombre: ['',Validators.required],
        fechaRegistro: ['',Validators.required],
        idDecanato: ['',Validators.required],        
        idDepartamento: ['',Validators.required],        
        idFacultad: ['',Validators.required],        
        idCampoConocimiento: ['',Validators.required],
        idCategoriaInvestigacion: ['',Validators.required],
        idTipoInvestigacion: ['',Validators.required],
        idGrado: ['',Validators.required],        
        descripcionProblema: ['', Validators.required],
        // resumen: ['', Validators.required],
        objetivos: ['', Validators.required],
        // resultados: ['', Validators.required],
        // fuenteFinanciamiento: ['', Validators.required],
        idDisciplina: ['',Validators.required],      
        idSubdisciplina: ['',Validators.required],   
        idLineaInvestigacion: ['', Validators.required],     
        estadoCodigo: ['',Validators.required],
        // productoGenerado: ['', Validators.required],
        // beneficiario: ['',Validators.required],
        fechaInicio: ['',Validators.required],
        fechaFin: ['',Validators.required],
        // duracionEstimada: ['',Validators.required],
        colaboradores: this.fb.array([]),
        alumnos: this.fb.array([]),
        investigadoresExternos: this.fb.array([]),        
        // imagen: [null],
        nombreArchivoImagen: ['', Validators.required]  
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
      idUsuario: [''],
      nombre: [''],
      participacion: [''],
      horas: ['']
    });

    const alumnoFormGroup = this.fb.group({
      idUsuario: [''],
      nombre: [''],
      participacion: [''],
      horas: ['']
    });

    const investigadorFormGroup = this.fb.group({
      idUsuario: [''],
      nombre: [''],
      participacion: [''],
      horas: ['']
    });

    interface CamposTabla {
      idUsuario: string;
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
          idUsuario: myArray[0],
          nombre: ordenar_nombre.toUpperCase()
        };
        this.listColaboradores.push(obj1);
        colaboradorFormGroup.get('idUsuario')?.setValue(obj1.idUsuario);
        colaboradorFormGroup.get('nombre')?.setValue(obj1.nombre);
        console.log('Valor de nomina:', colaboradorFormGroup.get('idUsuario')?.value);
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
          idUsuario: myArray[0],
          nombre: ordenar_nombre.toUpperCase()
        };
        this.listAlumnos.push(obj2);
        alumnoFormGroup.get('idUsuario')?.setValue(obj2.idUsuario);
        alumnoFormGroup.get('nombre')?.setValue(obj2.nombre);
        console.log('Valor de nomina:', alumnoFormGroup.get('idUsuario')?.value);
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
          idUsuario: myArray[0],
          nombre: ordenar_nombre.toUpperCase()
        };
        this.listInvestigadores.push(obj3);
        investigadorFormGroup.get('idUsuario')?.setValue(obj3.idUsuario);
        investigadorFormGroup.get('nombre')?.setValue(obj3.nombre);
        console.log('Valor de nomina:', investigadorFormGroup.get('idUsuario')?.value);
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

  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  suscribeToDropdownChanges() {
    var decanatoDropdown = this.proyectoForm.get("idDecanato");
    decanatoDropdown?.valueChanges.subscribe(selectedDecanato => {
      this.getFacultades(selectedDecanato);
      this.proyectoForm.get("idDepartamento")?.setValue("");
    });
    var facultadDropdown = this.proyectoForm.get("idFacultad");
    facultadDropdown?.valueChanges.subscribe(selectedFacultad => {
      this.getDepartamentos(selectedFacultad);
    });

    var campoConocimientoDropdown = this.proyectoForm.get("idCampoConocimiento");
    campoConocimientoDropdown?.valueChanges.subscribe(selectedCampoConocimiento => {
      this.getDisciplinas(selectedCampoConocimiento);
      //this.proyectoForm.get("idSubdisciplina")?.setValue("");
    });
    var disciplinaDropdown = this.proyectoForm.get("idDisciplina");
    disciplinaDropdown?.valueChanges.subscribe(selectedDisciplina => {
      this.getSubdisciplinas(selectedDisciplina);
    })
    var subdisciplinaDropdown = this.proyectoForm.get("idSubdisciplina");
    subdisciplinaDropdown?.valueChanges.subscribe(selectedSubdisciplina => {
      this.getLineasInvestigacion(selectedSubdisciplina);
    });
  }

  getDepartamentos(selectedFacultad: number) {
    this.lookupService.lookupDepartamentos(selectedFacultad).subscribe(data => {
      this.departamentos = data as Array<any>;
      console.log("departamentos", this.departamentos)
      var ctrl = this.proyectoForm.get("idDepartamento");
      if (this.departamentos.length == 0) {
        ctrl?.setValidators(null);
        ctrl?.setErrors(null);
      } else if (!ctrl?.value) {
        ctrl?.setValidators(Validators.required);
        ctrl?.setErrors({ required: true });
      }
      console.log("control departamento", this.proyectoForm.get("idDepartamento"))
    })
  }
  getFacultades(idDecanato: number) {
    this.lookupService.lookupFacultad(idDecanato).subscribe(data => {
      this.facultades = data as Array<any>;
      console.log("facultades", this.facultades)
      var ctrl = this.proyectoForm.get("idFacultad");
      if (this.facultades.length == 0) {
        ctrl?.setValidators(null);
        ctrl?.setErrors(null);
        var dpto = this.proyectoForm.get("idDepartamento");
        dpto?.setValidators(null);
        dpto?.setErrors(null);
        dpto?.setValue("");
      } else if (!ctrl?.value) {
        ctrl?.setValidators(Validators.required);
        ctrl?.setErrors({ required: true });
      }
    })
  }

  getDisciplinas(idCampoConocimiento: number) {
    this.lookupService.lookupDiciplinaDeCampo(idCampoConocimiento).subscribe(data => {
      this.disciplinas = data as Array<any>;
      var ctrl = this.proyectoForm.get("idDisciplina");
      if (this.disciplinas.length == 0) {
        ctrl?.setValidators(null);
        ctrl?.setErrors(null);
        var sub = this.proyectoForm.get("idSubdisciplina");
        sub?.setValidators(null);
        sub?.setErrors(null);
        sub?.setValue("");
      } else if (!ctrl?.value) {
        ctrl?.setValidators(Validators.required);
        ctrl?.setErrors({ required: true });
      }
    })
  }

  getSubdisciplinas(idDisciplina: number) {
    this.lookupService.lookupSubDisciplinaDeDisciplina(idDisciplina).subscribe(data => {
      this.subdisciplinas = data as Array<any>;
      var ctrl = this.proyectoForm.get("idSubdisciplina");
      if (this.subdisciplinas.length == 0) {
        ctrl?.setValidators(null);
        ctrl?.setErrors(null);
        var sub = this.proyectoForm.get("idLineaInvestigacion");
        sub?.setValidators(null);
        sub?.setErrors(null);
        sub?.setValue("");
      } else if (!ctrl?.value) {
        ctrl?.setValidators(Validators.required);
        ctrl?.setErrors({ required: true });
      }
    })
  }


  getLineasInvestigacion(idSubdisciplina: number) {
    this.lookupService.lookupLineaInvestigacion(idSubdisciplina).subscribe(data => {
      this.lineasInvestigacion = data as Array<any>;
      var ctrl = this.proyectoForm.get("idLineaInvestigacion");
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
  //   return ['nombre','titulo','fechaRegistro','fechaInicio','fechaFin','resumen','idDecanato','userId','objetivos','programaIdPrograma','estadoLookupEstadoCodigo'];
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
      const formData = new FormData();
      formData.append('body', JSON.stringify(this.proyectoForm.value));
      if (this.selectedImage) {
        formData.append('imagen', this.selectedImage);
      }
      this.proyectoService.saveProyecto(this.proyectoForm.value, this.selectedImage).subscribe(response => {
        this.confirmationModal.ack("Operación Exitosa", response);
        this.router.navigate(['/investigador']);
      }, error => {
        console.error('Error al crear el proyecto', error);
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
   
    
  open(event: Event, content:any) {
    event.preventDefault();
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
    // if (this.proyectoForm.invalid) {
    //   return;
    // }
    console.log('Datos del Formulario:', this.proyectoForm.value);
  }

  
}
