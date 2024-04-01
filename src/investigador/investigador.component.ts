import { Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { Router } from '@angular/router';
import {
  AngularGridInstance,
  Column,
  Formatter,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { InvestigadorService } from './investigador.service';
import { AppModalService } from 'src/app/modals/app-modal.service';

const actionFormatter:Formatter = function (row:number, cell:number, value:any, columnDef:Column, datacontext:any, grid?:any) {    
    return '<img id="edit" src="assets/img/editar.png" width="50px" height="50px" />'  
  }

const secondActionFormatter:Formatter = function (row:number, cell:number, value:any, columnDef:Column, datacontext:any, grid?:any) {  
  return '<img id="format" src="assets/img/formato-tabla.png" width="50px" height="50px" />'
}

const thirdActionFormatter:Formatter = function (row:number, cell:number, value:any, columnDef:Column, datacontext:any, grid?:any) {  
  return '<img id="delete" src="assets/img/trash-can.png" width="45px" height="45px" />'
}


const myCustomCSS:Formatter = function (row:number, cell:number, value:any, columnDef:Column, datacontext:any, grid?:any){
  let actions= "";
  if (datacontext['estadoLookupEstadoCodigo'] && datacontext['estadoLookupEstadoCodigo'] == 3){
    actions+="<div style='height:60px; background-color: #58946c; color:white; font-weight: bold;'>" + value + "</div>";
  }
  if (datacontext['estadoLookupEstadoCodigo'] && datacontext['estadoLookupEstadoCodigo'] == 4){
    actions+="<div style='height:60px; background-color: #fffc3c; color:black; font-weight: bold;'>" + value + "</div>";
  }
  return actions;
}

@Component({
selector: 'app-admin',
templateUrl: './investigador.component.html',
styleUrls: ['./investigador.component.css'],
encapsulation: ViewEncapsulation.None
})
export class InvestigadorComponent implements OnInit{
    constructor(private investigadorService:InvestigadorService, private router:Router, private modalService: AppModalService){}

    columnDefinitions1: Column[] = [];
    gridOptions1!: GridOption;
    dataset1!: any[];
    angularGrid: AngularGridInstance | undefined;
    gridObj:any;
  
    async ngOnInit(): Promise<void> {
      this.columnDefinitions1 = [
        { id: 'idProyecto', name: 'Identificador', field: 'idProyecto', sortable: true, filterable:true, minWidth: 200, maxWidth: 200 },
        { id: 'nombre', name: 'Nombre del Alumno', field: 'nombre', sortable: true, filterable:true, minWidth: 350, maxWidth: 350},                
        { id: 'titulo', name: 'Título', field: 'titulo', sortable: true, filterable:true, minWidth: 930, maxWidth: 930, formatter: myCustomCSS},                
        // { id: 'titulo', name: 'Título', field: 'titulo', sortable: true, filterable:true, minWidth: 930, maxWidth: 930},                
        { id: 'fechaInicio', name: 'Fecha inicio', field: 'fechaInicio',filterable:true, sortable:true, minWidth: 70, maxWidth: 70 },      
        { id: 'fechaFin', name: 'Fecha Fin', field: 'fechaFin',filterable:true, sortable:true, minWidth: 70, maxWidth: 70 },                        
        { id: 'formato', name: 'Formato', field: 'formato',sortable:false, formatter:secondActionFormatter, minWidth: 70, maxWidth: 70}, 
        { id: 'actions', name: 'Editar', field: 'editar', sortable: false, minWidth: 70, maxWidth: 70, formatter:actionFormatter,
          onCellClick:(e:Event, args: OnEventArgs) => {
            var target:any = e.target;
            if (target['id'] == 'edit') {
              this.editProyecto(this.gridObj.getDataItem(args.row).id);
            }
          }
        },
        { id: 'eliminar', name: 'Eliminar', field: 'eliminar',sortable:false, minWidth: 70, maxWidth: 70, formatter:thirdActionFormatter, 
          onCellClick:(e:Event, args: OnEventArgs) => {
            var target:any = e.target;
            if (target['id'] == 'delete') {
              this.deleteProyecto(this.gridObj.getDataItem(args.row).idProyecto);
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
        rowHeight:60,
        createFooterRow: true,
        showFooterRow:true
      };
      this.dataset1 = await this.getProyectos();
    }
  
    async deleteProyecto(proyectoId: number) {
      let res = await this.modalService.confirm("Confirmación", "¿Estas seguro de borrar el proyecto con id " + proyectoId + "?");
      if (res) {
        this.investigadorService.deleteProyectoById(proyectoId).subscribe(res => {
          this.deleteRow(proyectoId);
          this.modalService.ack("Operación exitosa", res);
        });
      }
    }
    
    deleteRow(proyectoId:number) {
      this.angularGrid?.gridService.deleteItemById(proyectoId);
    }
  
    editProyecto(id: number) {
      this.router.navigate(['/investigador/investigador-listing/update/' + id]);
    }

    padTo2Digits(num: number) {
      return num.toString().padStart(2, '0');
    }

    formatDate(date: Date) {
      return (
        [
          date.getFullYear(),
          this.padTo2Digits(date.getMonth() + 1),          
        ].join('/')
      );
    }

    async getProyectos() {
      // mock a dataset
      const tmpDataset:any = [];
      var res = await this.investigadorService.fetchAllProyectos();            
      let i = 0;                  
      for (let proy of res as Array<any>) {
          // const apellidos = usr.apellidoPaterno+" "+usr.apellidoMaterno;          
          const fecha_inicio = this.formatDate(new Date(proy.fechaInicio));      
          const fecha_fin = this.formatDate(new Date(proy.fechaFin));      

          tmpDataset[i] = {
            id: i,
            idProyecto: proy.idProyecto,
            titulo: proy.titulo,            
            nombre: proy.nombre,
            fechaInicio: fecha_inicio,
            fechaFin: fecha_fin,
            estadoLookupEstadoCodigo: proy.estadoLookupEstadoCodigo                                    
          };
          i++;                  
      }            
      console.log(tmpDataset);
      return tmpDataset;    
    }
      
    angularGrid2Ready(angularGrid: AngularGridInstance) {
      this.angularGrid = angularGrid;
      this.gridObj = angularGrid.slickGrid;
    }
  
    addProyecto() {
      this.router.navigate(['/investigador/investigador-listing/add/0'])
    }
    
}

