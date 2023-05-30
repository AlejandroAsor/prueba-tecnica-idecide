import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private authService: AuthService, private router: Router) { }

  get isLoggedIn(): boolean {
    return this.authService.getIsAuthenticated();
  }

  get isLoginPage(): boolean {
    return this.router.url != '/login';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
