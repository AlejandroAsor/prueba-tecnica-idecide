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
  registerRol = 'ADMIN_ROLE';
  registerEstado = false;
  registerGoogleAux = false;
  userData: any = {};

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    this.isLoggedIn = !!token;

    // Verificar si se accedió directamente a la página de inicio de sesión
    const isDirectAccess = !this.router.getCurrentNavigation()?.previousNavigation;

    if (this.isLoggedIn && isDirectAccess) {
      const email = localStorage.getItem('email');
      if (email) {
        this.apiService.search(email, 'usuarios', token).subscribe(
          (response: any) => {
            console.log('User data:', response);
            this.userData = response;
            // Actualizar la información del usuario basada en la respuesta
            this.email = this.userData.correo;
            this.name = this.userData.nombre;
            this.registerRol = this.userData.rol;
            this.registerEstado = this.userData.estado;
            console.log('Updated user data:', this.userData);
          },
          (error: any) => {
            console.error('Error fetching user data:', error);

          }
        );
      }
    }
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
        localStorage.setItem('email', user.correo);

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
            this.router.navigate(['']);
          },
          (loginError: any) => {
            console.log('LoginComponent auto login error:', loginError);
          }
        );
      },
      (error: any) => {
        console.log('LoginComponent register error:', error);
        alert('Error al registrarse: Verifica tus datos');

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
          localStorage.setItem('email', credentials.correo);
        } catch (error) {
          console.error('Error al autenticar y configurar el token:', error);
        }
        this.router.navigate(['']);
      },
      (error: any) => {
        console.log('LoginComponent login error:', error);
        alert('Error al iniciar sesión: Verifica tus datos');

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
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }
}

