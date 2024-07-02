import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { User } from 'src/app/models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //Esta URL obtine el listado de todos los usuarios en el backend
  // private baseURL = 'http://localhost:8080/api/users';
  // private baseURL = 'https://politik-backend-production.up.railway.app'; //pruebo cambiarla para la de railway
  private baseURL = environment.apiUrl;

  private currentUser!: User;

  constructor(private httpClient: HttpClient, private router: Router) { }

  //Este metodo obtiene todos los usuarios del backend
  getUsersList(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseURL}`);
  }

  //Comrpobar si un usuario existe en el backend byPhone
  getUserByPhone(phone: string): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<User>(`${this.baseURL}/phone`, phone, { headers: headers });
  }

  //checkeo si existe algun usuario con el mismo email
  getUserByEmail(email: string): Observable<User> {
    return this.httpClient.post<User>(`${this.baseURL}/email`, email);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.httpClient.post<User>(`${this.baseURL}/username`, username);
  }

  //mandará el userDTO al userController del backend para que setee los datos y los almacene en la base de datos
  signup(userDTO: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseURL}/signup`, userDTO, {
      observe: 'response'
    }).pipe(map((response: HttpResponse<any>) => {
      const body = response.body;
      const headers = response.headers;

      const bearerToken = headers.get('Authorization')!;
      console.log("user.service.ts - signup() - bearerToken ", bearerToken);
      const jwt = bearerToken.replace('Bearer ', '');

      console.log("user.service.ts - signup() - jwt ", jwt);

      localStorage.setItem('jwt', jwt);

      return body;
    }));
  }

  //mando al backend el username y el password para que compruebe si es correcto
  // login(username: string, password: string): Observable<any> {
  //   return this.httpClient.post<any>(`${this.baseURL}/login`, { username, password }, {
  //     observe: 'response'
  //   }).pipe(map((response: HttpResponse<any>) => {
  //     const body = response.body;
  //     const headers = response.headers;
  //     console.log('response.headers -> ', response.headers);

  //     const bearerToken = headers.get('Authorization')!;
  //     const jwt = bearerToken.replace('Bearer ', '');
  //     console.log("user.service.ts - login() - jwt ", jwt);

  //     localStorage.setItem('jwt', jwt );
  //     console.log("user.service.ts - login() -------------------------------us");

  //     return body;
  //     }));
  // }

  login(username: string, password: string): Observable<any> {
    console.log("user.service.ts - login() -------------------------------us");
    return this.httpClient.post(`${this.baseURL}/login`, { username, password }, { responseType: 'text' as 'json', observe: 'body' });
  }

  getToken() {
    return localStorage.getItem('token');
  }

  //cerrar sesion -> borro el token del localStorage y redirijo a start.page
  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('currentUser');
    //AQUI CREO QUE ME FALTA EL HACER EL LOGOUT DE LA SESION O DEL USERAUTH. YA QUE SI NO, AUNQUE NO TENGA EL TOKEN, NI USER, PODRIA SEGUIR ACCEDIENDO A LAS PAGINAS PONIENDO /HOME POR EJEMPLO
    this.router.navigate(['/start']);
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
    //para que no se pierdan cuando la página se recarga, lo guardo en el localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    //
  }

  getCurrentUser() {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
    return this.currentUser;
  }

}
