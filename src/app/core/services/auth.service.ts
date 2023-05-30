import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  private isAuthenticated: boolean = false;
  private token: string = localStorage.getItem('token') || '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  canActivate(): boolean {
    if (this.isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  setAuthenticated(value: boolean): void {
    this.isAuthenticated = value;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string {
    if (!this.token) {
      this.token = this.getTokenFromLocalStorage() || '';
    }
    return this.token;
  }

  clearToken(): void {
    this.token = '';
    localStorage.removeItem('token');
  }

  getUserDetails(): Observable<any> {
    const userId = this.getCurrentUser()?.uid;
    return this.apiService.getUsers(this.token).pipe(
      map((response: any) => {
        const usuarios = response.usuarios;
        return usuarios.find((usuario: any) => usuario.uid === userId);
      })
    );
  }
  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }


  logout(): void {
    this.clearToken();
    this.setAuthenticated(false);
  }

  register(user: any): Observable<any> {
    return this.apiService.createUser(user);
  }

  private getCurrentUser(): any {
    const userString = localStorage.getItem('usuario');
    if (userString && userString !== 'undefined') {
      return JSON.parse(userString);
    } else {
      return null;
    }
  }

  private getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('token');
  }
}
