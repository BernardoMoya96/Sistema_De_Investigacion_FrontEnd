import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-role-selection-dialog',
  templateUrl: './user-role-selection-dialog.component.html',
  styleUrls: ['./user-role-selection-dialog.component.css']
})
export class UserRoleSelectionDialogComponent implements OnInit {

  @Input() options:Array<any> | undefined;

  constructor(private modal: NgbActiveModal) { }

  selectedRole:number | null = null;

  ngOnInit(): void {
  }

  continue() {
    if (!this.selectedRole) {
      return alert("Por favor selecciona un rol")
    }
    this.modal.close(this.selectedRole);
  }

}
