import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  @Input() title: string | undefined;
  @Input() message: string | undefined;
  @Input() btnOKText:string | undefined;
  @Input() btnCancelText:string | undefined;

  constructor(private modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  decline(){
    this.modal.close(false);
  }

  accept() {
    this.modal.close(true);
  }

  public dismiss() {
    this.modal.dismiss();
  }

}
