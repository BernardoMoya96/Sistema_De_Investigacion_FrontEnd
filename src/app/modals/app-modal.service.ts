import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AppModalService {

  constructor(private modalService: NgbModal) { 

  }

  public confirm(
    title:string, 
    message: string,
    btnOKText:string = 'Si',
    btnCancelText:string = 'Cancelar',
    dialogSize: 'sm' | 'lg' = 'sm') : Promise<boolean>{
      const modalRef = this.modalService.open(ConfirmationDialogComponent, {size: dialogSize, windowClass: 'modal-normal'});
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.message = message;
      modalRef.componentInstance.btnOKText = btnOKText;
      modalRef.componentInstance.btnCancelText = btnCancelText;
      return modalRef.result;
  }


  public ack(
    title:string, 
    message: string,
    btnOKText:string = '',
    btnCancelText:string = 'OK',
    dialogSize: 'sm' | 'lg' = 'sm') : Promise<boolean>{
      const modalRef = this.modalService.open(ConfirmationDialogComponent, {size: dialogSize});
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.message = message;
      modalRef.componentInstance.btnOKText = btnOKText;
      modalRef.componentInstance.btnCancelText = btnCancelText;
      return modalRef.result;
  }


}
