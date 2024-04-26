import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/admin/admin.service';
import { LookupService } from 'src/app/lookup.service';
import { AppModalService } from 'src/app/modals/app-modal.service';
import { InvestigadorService } from '../investigador.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
  usuarios: Array<any> = [];
  alumnos: Array<any> = [];
  colaboradores: Array<any> = [];
  investigadores: Array<any> = [];
  estadoLookup: Array<any> = [];
  decanatos: Array<any> = [];
  campoConocimiento: Array<any> = [];
  disciplinas: Array<any> = [];
  subdisciplinas: Array<any> = [];
  lineasInvestigacion: Array<any> = [];
  categoriaInvestigacion: Array<any> = [];
  tipoInvestigacion: Array<any> = [];
  grado: Array<any> = [];
  fuenteFinanciamientos: Array<any> = [];
  productoGenerado: Array<any> = [];
  proyectoForm!: FormGroup;
  userForm!: FormGroup;
  mode: string | undefined;
  fileStr: string | ArrayBuffer | null = null;
  tiposUsuario: Array<any> = [];
  facultades: Array<any> = [];
  departamentos: Array<any> = [];
  userName: string = "";
  // productosGenerados: Array<any>  = [];


  constructor(private sessionService: SessionService, private adminService: AdminService, private proyectoService: InvestigadorService, private lookupService: LookupService,
    private confirmationModal: AppModalService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private modalService: NgbModal, private formBuilder: FormBuilder) {
    this.listColaboradores = [];
    this.listAlumnos = [];
    this.listInvestigadores = [];
    this.estadoLookup = [];
    this.decanatos = [];

    this.proyectoForm = this.fb.group({
      colaboradores: this.fb.array([]),
      alumnos: this.fb.array([]),
      investigadoresExternos: this.fb.array([])
    });
  }




  onSubmit(userType: string) {
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
        break;

      default:
        // Manejar caso por defecto o error
        break;
    }

  }


  public addItem(): void {
   
    console.log("Hola");
  }
  reset() {
    this.proyectoForm.reset();
  }

  ngOnInit(): void {

    this.userForm = this.formBuilder.group({
      colaboradores: [''],
      alumnos: [''],
      investigadores: ['']
    });
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
      this.colaboradores = data as Array<any>;
      this.colaboradores.forEach(colaborador => {
        console.log("Colaboradores: " + `ID: ${colaborador.id}, Nombre: ${colaborador.nombres} ${colaborador.apellidoPaterno} ${colaborador.apellidoMaterno}`);
      });
    })
    this.adminService.fetchAllInvestigadores().then(data => {
      this.investigadores = data as Array<any>;
      this.investigadores.forEach(investigador => {
        console.log("Investigadores: " + `ID: ${investigador.id}, Nombre: ${investigador.nombres} ${investigador.apellidoPaterno} ${investigador.apellidoMaterno}`);
      });
    })
    this.adminService.fetchAllStudents().then(data => {
      this.alumnos = data as Array<any>;
      this.alumnos.forEach(alumno => {
        console.log("Alumnos: " + `ID: ${alumno.id}, Nombre: ${alumno.nombres} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`);
      });
    })
    this.lookupService.lookupFinanciamiento().then(data => {
      this.fuenteFinanciamientos = data as Array<any>;
    })
    if (this.mode == 'update') {
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


  open(content: any) {
    this.modalService.open(content);
  }

  deleteRow(index: number, listName: string): void {
    switch (listName) {
      case 'colaboradores':
        this.listColaboradores.splice(index, 1);
        break;
      case 'alumnos':
        this.listAlumnos.splice(index, 1);
        break;
      case 'investigadores':
        this.listInvestigadores.splice(index, 1);
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
