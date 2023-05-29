import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('AuthGuard canActivate');
    if (this.authService.getToken()) {
      return true; // Si hay un token en el LocalStorage, permite el acceso
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
