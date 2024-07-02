import { Component, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements AfterViewInit {

  @ViewChild('btnCreate') btnCreate!: ElementRef; //para ello en el html debo poner #btnCreate
  @ViewChild('btnLogin') btnLogin!: ElementRef;

  constructor(private router: Router, private renderer: Renderer2, private dialog: MatDialog) { }

  ngAfterViewInit(): void {

    this.renderer.listen(this.btnCreate.nativeElement, 'click', () => {
      this.router.navigate(['/landing']);
    });

    this.renderer.listen(this.btnLogin.nativeElement, 'click', () => {
      this.openDialogLogin();
    });
  }

  openDialogLogin() {
    this.dialog.open(LoginComponent, {
      width: '40%',
      height: '90%',
      panelClass: 'custom-dialog',
    });
  }

}
