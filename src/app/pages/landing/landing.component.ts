import { MatDialog } from '@angular/material/dialog';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  constructor(
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2,
    private dialog: MatDialog
  ) { }

  ngAfterViewInit() {
    const politicRol = this.el.nativeElement.querySelector('#btnL');
    const citizenRol = this.el.nativeElement.querySelector('#btnR');

    this.renderer.listen(politicRol, 'click', () => {
      this.openDialogSignup('politic');
    });

    this.renderer.listen(citizenRol, 'click', () => {
      this.openDialogSignup('citizen');
    });
  }

  openDialogSignup(rol: string) {
    this.dialog.open(SignupComponent, {
      data: { rol: rol },
      width: '40%',
      height: '90%'
    });
  }
}
