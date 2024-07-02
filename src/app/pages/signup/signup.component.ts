import { UserService } from 'src/app/services/user/user.service';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, catchError, firstValueFrom, map, of } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  rol: string;
  showUseEmailDiv = false; //True -> si el usuario pulsa el btn usar el email para registrarse
  showSecondPart = false; //True -> sí no existe un usuario con ese phone, email or username

  formSignup!: FormGroup;

  userData: any = {}; // Inicializar el objeto para almacenar los datos del formulario
  phoneExists: boolean = false; //True -> si el teléfono ya existe en la base de datos
  emailExists: boolean = false; //True -> si el email ya existe en la base de datos

  userDTO: any = {}; //Objeto que se enviará al backend para crear el usuario y la passwd

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) {
    this.rol = data.rol; // recibe el rol del landing.component.ts
  }

  ngOnInit(): void {
    this.formSignup = this.initForm();
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      firstPart: this.formBuilder.group({
        name: ['', [Validators.required, Validators.maxLength(25)]],
        lastname: ['', [Validators.required, Validators.maxLength(30)]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
        email: ['', [Validators.required, Validators.email]],
      }),
      secondPart: this.formBuilder.group({
        birthday: ['', [Validators.required, Validators.pattern(/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)]],
        username: ['', [Validators.required, Validators.maxLength(25)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
      }),
    });
  }

  onSubmit(formSignup: any) {
    if (this.showSecondPart) {
      const secondPart = formSignup.get('secondPart');
      if (secondPart?.valid) {

        //creo el objeto userDTO para enviarlo al backend
        this.userDTO = {
          username: formSignup.get('secondPart')?.get('username')?.value,
          rol: this.rol,
          name: formSignup.get('firstPart')?.get('name')?.value,
          lastname: formSignup.get('firstPart')?.get('lastname')?.value,
          phone: formSignup.get('firstPart')?.get('phone')?.value,
          email: formSignup.get('firstPart')?.get('email')?.value,
          birthday: formSignup.get('secondPart')?.get('birthday')?.value,
          password: formSignup.get('secondPart')?.get('password')?.value,
        };

        console.log('signup.ts --> this.userDTO: ', this.userDTO);

        this.userService.signup(this.userDTO).subscribe({
          next: (response: any) => {
            console.log(response);
            console.log("Formulario válido");
            // localStorage.setItem('jwt', response.jwt);
            this.userService.setCurrentUser(response.user);
          },
          error: (error: any) => {
            console.log("Formulario no valido al mandar los datos al backend");
            console.log(error);
            // Maneja el error aquí si es necesario
          },
          complete: () => {
            console.log("Petición completa");
            this.closeDialog();
            this.router.navigate(['/home']);
          }
        });
      } else {
        console.log("Formulario no valido en frontend");
      }
    }
  }

  async checkUser() {
    const firstPart = this.formSignup.get('firstPart');

    console.log(firstPart?.get('phone')?.value);
    if (firstPart?.get('name')?.valid && firstPart?.get('lastname')?.valid) {
      if (!this.showUseEmailDiv && firstPart?.get('phone')?.valid) {
        //Se suscribe a la función checkPhone() y espera a que devuelva un valor
        //Si devuelve true, es que el teléfono ya existe en la base de datos --> error
        const phoneExists = await firstValueFrom(this.checkPhone(firstPart?.get('phone')?.value));
        if (phoneExists) {
          console.log('El teléfono ya existe checkUser()');
          this.phoneExists = true;
          return;
        } else {
          console.log("El teléfono no existe checkUser()");
          this.showSecondPart = true;
        }
      } else if (this.showUseEmailDiv && firstPart?.get('email')?.valid) {
        const emailExists = await firstValueFrom(this.checkEmail(firstPart?.get('email')?.value));
        if (emailExists) {
          this.emailExists = true;
          console.log('El email ya existe checkUser()');
          return;
        } else {
          console.log("El email no existe checkUser()");
          this.showSecondPart = true;
        }
      }
    } else {
      console.log('El firstPart-Form no es válido. Por favor, completa todos los campos.');
    }
  }

  //Comprueba si el teléfono ya existe en la base de datos, si existe devuelve true
  //ese valor lo recogerá checkUser() y si es true(que ya existe el phone) mostrará un mensaje de error
  private checkPhone(phone: string): Observable<boolean> {
    return this.userService.getUserByPhone(phone).pipe(
      map(user => {
        if (user) return true;
        else return false;
      }),
      catchError(error => {
        console.error('Error: checkPhone() - ya existe en la db ', error);
        return of(false);
      })
    );
  }

  //Comprueba si el email ya existe en la base de datos, si existe devuelve true
  private checkEmail(email: string): Observable<boolean> {
    return this.userService.getUserByEmail(email).pipe(
      map(user => {
        if (user) return true;
        else return false;
      }),
      catchError(error => {
        console.log("Error: checkEmail() - ya existe en la db ", error);
        return of(false);
      })
    );
  }



  //para mostrar/ocultar la contraseña
  showPassword = false;
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  useEmail() {
    this.showUseEmailDiv = true;
    this.userData.phone = '';
  }
  usePhone() {
    this.showUseEmailDiv = false;
    this.userData.email = '';
  }

  //Si ya tiene cuenta, lo redirige al login(start)
  goToStart() {
    this.closeDialog();
    this.router.navigate(['/start']);
  }

  goBack() {
    this.showSecondPart = false;
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
