import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { Router } from '@angular/router';
import {
  AngularGridInstance,
  Column,
  Formatter,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { AppConfig } from 'src/app/app-config-props';
import { AppModalService } from 'src/app/modals/app-modal.service';
import { AdminService } from './admin.service';


const actionFormatter:Formatter = function (row:number, cell:number, value:any, columnDef:Column, datacontext:any, grid?:any) {
  let actions = "<span style='color:grey;'><i id='edit' title='Editar Usuario' class='fa fa-edit'></i></span>";
  if (datacontext['rol'] && datacontext['rol'].includes('INVESTIGADOR')) {
    actions += "<span style='color:grey; margin-left:10px;'><i id='ver-web-investigador' title='Ver pagina web de investigador' class='fa fa-globe'></i></span>"
    actions += "<span style='color:grey; margin-left:10px;'><i id='editar-web-investigador' title='Editar contenido estatico de pagina web' class='fa fa-external-link'></i></span>"
  }
  actions += "<span style='color:grey; margin-left:10px;'><i id='borrar' title='Borrar usuario' class='fa fa-trash'></i></span>"
  return actions;
}


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {


  constructor(private adminService:AdminService, 
    private router:Router, private modalService: AppModalService, private cd: ChangeDetectorRef){}

  columnDefinitions1: Column[] = [];
  gridOptions1!: GridOption;
  dataset1!: any[];
  angularGrid: AngularGridInstance | undefined;
  gridObj:any;

  async ngOnInit(): Promise<void> {
    this.columnDefinitions1 = [
      { id: 'id', name: 'Matrícula o Nómina', field: 'id', sortable: true, filterable:true },
      { id: 'nombres', name: 'Nombres', field: 'nombres', sortable: true, filterable:true },
      { id: 'apellidos', name: 'Apellidos', field: 'apellidos', sortable: true, filterable:true },
      { id: 'email', name: 'Email', field: 'email',filterable:true, sortable:true },
      { id: 'rol', name: 'Rol', field: 'rol', sortable:true },
      { id: 'actions', name: 'Editar', field: 'id', sortable: false, formatter:actionFormatter,
        onCellClick:(e:Event, args: OnEventArgs) => {
          var target:any = e.target;
          if (target['id'] == 'edit') {
            this.editUser(this.gridObj.getDataItem(args.row).id);
          } else if (target['id'] == 'editar-web-investigador') {
            this.editResearcherWeb(this.gridObj.getDataItem(args.row).id);
          } else if (target['id'] == 'ver-web-investigador') {
            this.openResearcherWeb(this.gridObj.getDataItem(args.row).email);
          } else if (target['id'] == 'borrar') {
            this.deleteUser(this.gridObj.getDataItem(args.row).id);
          }
        }
      }
    ];
    this.gridOptions1 = {
      enableAutoResize: true,
      enableSorting: true,
      enableAutoSizeColumns:true,
      enableColumnPicker:true,
      enableCellNavigation:true,
      enableFiltering:true,
      showPreHeaderPanel:true,
      preHeaderPanelHeight: 30,
      autoFitColumnsOnFirstLoad:true,
      rowHeight:25,
      createFooterRow: true,
      showFooterRow:true
    };
    this.dataset1 = await this.getUsers();
  }

  async deleteUser(userId: string) {
    let res = await this.modalService.confirm("Confirmación", "¿Estas seguro de borrar al usuario con id " + userId + "?");
    if (res) {
      this.adminService.deleteUser(userId).subscribe(res => {
        this.deleteRow(userId);
        this.modalService.ack("Operación exitosa", res);
      });
    }
  }

  deleteRow(userId:string) {    
    this.angularGrid?.gridService.deleteItemById(userId);
  }

  openResearcherWeb(email: string) {
    if (email.indexOf("@") > -1) {
      email = email.substring(0, email.indexOf("@"));
    }
    let url = AppConfig.RESEARCHER_WEB_URL + "/" +email + "/inicio";
    window.open(url, "_blank")?.focus();
  }

  editResearcherWeb(id: number) {
    let url = AppConfig.RESEARCHER_WEB_EDITOR_URL + "/" +id + "/inicio";
    window.open(url, "_blank")?.focus();
  }


  editUser(id: number) {
    this.router.navigate(['/admin/user-detail/update/' + id]);
  }

  async getUsers() {
    const tmpDataset:any = [];
    var res = await this.adminService.fetchAllUsers();
    console.log("response from fetch is", res)
    let i = 0;
    for (let usr of res as Array<any>) {
        const apellidos = usr.apellidoPaterno+" "+usr.apellidoMaterno;
        tmpDataset[i] = {
          id: usr.id,
          nombres: usr.nombres,
          apellidos: apellidos,
          email: usr.email,
          rol: usr.rol
        };
        i++;
    }
    return tmpDataset;
  }

  angularGrid2Ready(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
  }

  addUser() {
    this.router.navigate(['/admin/user-detail/add/0'])
  }
}
