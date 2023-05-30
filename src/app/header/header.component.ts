import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service'; // Asegúrate de que esta ruta de importación sea correcta
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout(); // Llama al método logout del servicio AuthService
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }
}
