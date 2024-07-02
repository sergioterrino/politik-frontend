import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  constructor(private dialog: MatDialog) {}

  sendEmail(){
    //falta hacer la petición al backend para saber si existe el username
    //si existe falta enviar el email al user para restablecer la contraseña
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
