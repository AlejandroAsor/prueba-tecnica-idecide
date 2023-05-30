import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoggedIn = false;
  errorMessage = '';
  email = localStorage.getItem('savedEmail') || '';
  password = '';
  name = '';
  registerEmail = '';
  registerPassword = '';
  registerName = '';
  registerRol = '';
  registerEstado = false;
  registerGoogleAux = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    this.isLoggedIn = !!token;


  }


  register(): void {
    const user = {
      nombre: this.registerName,
      correo: this.registerEmail,
      password: this.registerPassword,
      rol: this.registerRol,
      estado: this.registerEstado,
      googleAux: this.registerGoogleAux
    };

    this.authService.register(user).subscribe(
      (response: any) => {
        console.log('LoginComponent register response:', response);

        // Realizar inicio de sesión automáticamente
        const credentials = { correo: this.registerEmail, password: this.registerPassword };
        this.apiService.login(credentials).subscribe(
          (loginResponse: any) => {
            console.log('LoginComponent auto login response:', loginResponse);
            this.isLoggedIn = true;
            try {
              this.authService.setAuthenticated(true);
              this.authService.setToken(loginResponse.token);
            } catch (error) {
              console.error('Error al autenticar y configurar el token:', error);
            }
            this.router.navigate(['/inicio']); // Redirigir al inicio después del registro y login exitoso
          },
          (loginError: any) => {
            console.log('LoginComponent auto login error:', loginError);
          }
        );
      },
      (error: any) => {
        console.log('LoginComponent register error:', error);
        // Lógica después de un error de registro (por ejemplo, mostrar un mensaje de error)
      }
    );
  }


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
        // Redirigir al inicio después de iniciar sesión
        this.router.navigate(['/inicio']);
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
