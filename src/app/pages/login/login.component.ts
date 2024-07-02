import { UserService } from 'src/app/services/user/user.service';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError, map, of, firstValueFrom } from 'rxjs';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  showSecondPart = false; //sí no existe un usuario con ese phone, email or username

  formLogin!: FormGroup;

  //para las peticiones al backend, si encuentra un usuario con ese phone, email or username -> true exists
  phoneExists!: User | null; //True -> si el teléfono existe en la base de datos
  usernameExists!: User | null; //True -> si el username existe en la base de datos
  emailExists!: User | null; //True -> si el email existe en la base de datos

  usernameNotExists: boolean = false; //Por default, siempre existe el usuario, para que no salga el error-message
  phoneNotExists: boolean = false; //True -> si el teléfono no existe en la base de datos
  emailNotExists: boolean = false; //True -> si el email no existe en la base de datos

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {

  }

  ngOnInit(): void {
    this.formLogin = this.initForm(); //instanciamos el form
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      firstPart: this.formBuilder.group({
        namePhoneEmail: ['', [Validators.required]],
      }),
      secondPart: this.formBuilder.group({
        namePhoneEmail2: [''],
        password: ['', [Validators.required, Validators.minLength(8)]],
      })
    })
  }


  onSubmit(formLogin: FormGroup) {
    if (this.showSecondPart) {
      const secondPart = formLogin.get('secondPart');
      if (secondPart?.valid) {
        const namePhoneEmail = formLogin.get('secondPart.namePhoneEmail2')?.value;
        const password = formLogin.get('secondPart.password')?.value;
        //he de enviar el namePhoneEmail y el password al backend. Checkear si para dicho user, el password es correcto
        //he de diferenciar mediante que namePhoneEmail se logea -> (username, phone o email)
        if (this.usernameExists) {
          //antes de hacer el login(), como ya he comprobado que existe el usuario con dich username
          //Ahora voy a obtener el username del user. En este caso es fácil. Pero si fuera phone o email?
          const username = this.usernameExists.username;
          this.userService.login(username, password).subscribe({
            next: (jwt: string) => {
              console.log('login.ts - onSubmit() - jwt: ', jwt);
              localStorage.setItem('jwt', jwt);
              if (this.usernameExists) {
                this.userService.setCurrentUser(this.usernameExists);
                console.log(this.usernameExists);
              }
            },
            error: (error) => {
              console.log('login.component.ts - onSubmit() - if this.username - error login: ', error);
            },
            complete: () => {
              console.log('complete login');
              this.closeDialog();
              this.router.navigate(['/home']);
            }
          });
        } else if (this.phoneExists) {
          const username = this.phoneExists.username;
          this.userService.login(username, password).subscribe({
            next: (jwt: string) => {
              console.log('login.ts - onSubmit() - jwt: ', jwt);
              localStorage.setItem('jwt', jwt);
              if (this.phoneExists) this.userService.setCurrentUser(this.phoneExists);
            },
            error: (error) => {
              console.log('error login: ', error);
            },
            complete: () => {
              console.log('complete login');
              this.closeDialog();
              this.router.navigate(['/home']);
            }
          });
        } else if (this.emailExists) {
          const username = this.emailExists.username;
          this.userService.login(username, password).subscribe({
            next: (jwt: string) => {
              console.log('login.ts - onSubmit() - jwt: ', jwt);
              localStorage.setItem('jwt', jwt);
              if (this.emailExists) this.userService.setCurrentUser(this.emailExists);
            },
            error: (error) => {
              console.log('error login: ', error);
            },
            complete: () => {
              console.log('complete login');
              this.closeDialog();
              this.router.navigate(['/home']);
            }
          });
        }

      } else {
        console.log("Formulario no valido");
      }
    }
  }

  async checkUser() {
    const firstPart = this.formLogin.get('firstPart');
    const namePhoneEmailValue = this.formLogin.get('firstPart.namePhoneEmail')?.value;

    console.log('CheckUser() - valor del campo acceso -> ', namePhoneEmailValue);

    if (firstPart?.valid) {
      this.usernameExists = await firstValueFrom(this.checkUsername(namePhoneEmailValue));
      if (this.usernameExists) {
        console.log("checkUsername() - OK - Este username existe en la bd");
        this.formLogin.get('secondPart.namePhoneEmail2')?.setValue(namePhoneEmailValue);
        this.showSecondPart = true;
      } else {
        this.usernameNotExists = true;

        this.phoneExists = await firstValueFrom(this.checkPhone(namePhoneEmailValue));
        if (this.phoneExists) {
          console.log('checkPhone() - OK - Este phone existe en la bd');
          this.formLogin.get('secondPart.namePhoneEmail2')?.setValue(namePhoneEmailValue);
          this.showSecondPart = true;
        } else {
          this.phoneNotExists = true;

          this.emailExists = await firstValueFrom(this.checkEmail(namePhoneEmailValue));
          if (this.emailExists) {
            console.log('checkEmail() - OK - Este email existe en la bd');
            this.formLogin.get('secondPart.namePhoneEmail2')?.setValue(namePhoneEmailValue);
            this.showSecondPart = true;
          } else {
            this.emailNotExists = true;
          }
        }
      }
    }
  }

  private checkUsername(username: string): Observable<User | null> {
    return this.userService.getUserByUsername(username).pipe(
      map(user => {
        console.log('checkUsername() - user: ', user);
        if (user) return user;
        else return null;
      }),
      catchError(error => {
        console.log("error - checkUsername() ", error);
        return of(null);
      })
    );
  } 

  private checkPhone(phone: string): Observable<User | null> {
    return this.userService.getUserByPhone(phone).pipe(
      map(user => {
        if (user) return user;
        else return null;
        // else throw new Error('User not found byPhone');
      }),
      catchError(error => {
        console.error('Error: checkPhone() ', error);
        return of(null);
      })
    );
  }
  private checkEmail(email: string): Observable<User | null> {
    return this.userService.getUserByEmail(email).pipe(
      map(user => {
        if (user) return user;
        else return null;
      }),
      catchError(error => {
        console.log("Error: checkEmail() ", error);
        return of(null);
      })
    );
  }

  openForgotPassword() {
    this.closeDialog();
    this.dialog.open(ForgotPasswordComponent, {
      width: '40%',
      height: '90%'
    });
  }
  //para mostrar/ocultar la contraseña
  showPassword = false;
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  goBack() {
    this.showSecondPart = false;
  }
  closeDialog() {
    this.dialog.closeAll();
  }
}

