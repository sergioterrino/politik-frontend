import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('JwtInterceptor is running--------------------------');
    // Obtener el token del almacenamiento local
    let jwt = localStorage.getItem('jwt');
    console.log('jwtInterceptor -> jwt.localstorage: ', jwt);

    if (jwt) {
      // Clonar la solicitud y añadir el encabezado de autorización
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwt}`
        }
      });
    }
    return next.handle(request);
  }
}
