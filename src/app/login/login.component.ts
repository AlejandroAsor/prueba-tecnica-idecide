import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoggedIn = false;
  errorMessage = '';
  email = localStorage.getItem('savedEmail') || '';
  password = '';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  login(): void {
    const credentials = { correo: this.email, password: this.password };
    this.apiService.login(credentials).subscribe(
      (response: any) => {
        console.log('LoginComponent login response:', response);
        this.isLoggedIn = true;
        try {
          this.authService.setAuthenticated(true);
          this.authService.setToken(response.token);
        } catch (error) {
          console.error('Error al autenticar y configurar el token:', error);
        }
        this.router.navigate(['/']);
      },
      (error: any) => {
        console.log('LoginComponent login error:', error);
        this.isLoggedIn = false;
        try {
          this.authService.setAuthenticated(false);
        } catch (error) {
          console.error('Error al desautenticar:', error);
        }
        this.errorMessage = 'Credenciales inválidas. Inténtalo de nuevo.';
      }
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.authService.setAuthenticated(false);
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
