

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
// import * as jwt_decode from 'jwt-decode';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const jwt = localStorage.getItem('jwt');
    console.log("auth.guard.ts - canActivate() - jwt ", jwt);

    // Permitir el acceso a /start sin JWT
    if (!jwt && (route.routeConfig?.path === 'start' || route.routeConfig?.path === 'login')) {
      console.log("auth.guard.ts - canActivate() - no hay jwt pero permito entrar solo en /start navigate to /start ", jwt);
      return true;
    }

    if (jwt) {
      try {
        const decodedToken: any = jwtDecode(jwt);
        console.log("auth.guard.ts - canActivate() - decodedToken ", decodedToken.exp);
        console.log("auth.guard.ts - canActivate() - Date.now() ", Math.floor(Date.now() / 1000));
        // Si el JWT está expirado, redirigir a /start
        if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
          console.log("auth.guard.ts - canActivate() - JWT is expired");
          localStorage.removeItem('jwt');
          console.log("auth.guard.ts - canActivate() - navigate to /start ", jwt);
          this.router.navigate(['/start']);
          return false;
        }
        // Si el usuario está intentando acceder a /login o /start, redirigir a /home
        if (route.routeConfig?.path === 'login' || route.routeConfig?.path === 'start') {
          this.router.navigate(['/home']);
          return false;
        }
        return true;
      } catch (error) {
        console.log("auth.guard.ts - canActivate() - error ", error);
        localStorage.removeItem('jwt');
        this.router.navigate(['/start']);
        return false;
      }
    } else {
      console.log("auth.guard.ts - canActivate() - jwt null, entra en el else -->  navigate to /start ", jwt);
      this.router.navigate(['/start']);
      return false;
    }
  }

}
