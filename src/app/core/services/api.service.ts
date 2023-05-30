// api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://prueba-tecnica-idecide.azurewebsites.net/api';

  constructor(private http: HttpClient) {}

  login(credentials: { correo: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  getUsers(token: string): Observable<any> {
    const headers = this.getAuthenticatedHeaders(token);
    return this.http.get(`${this.baseUrl}/usuarios`, { headers });
  }

  createUser(user: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('ApiService createUser:', user);
    return this.http.post(`${this.baseUrl}/usuarios`, user, { headers });
  }



  updateUser(user: any, token: string): Observable<any> {
    const headers = this.getAuthenticatedHeaders(token);
    const { googleAux, ...updatedUser } = user;
    updatedUser.google = googleAux;
    return this.http.put(`${this.baseUrl}/usuarios/${user.uid}`, updatedUser, { headers });
  }

  deleteUser(userId: string, token: string): Observable<any> {
    const headers = this.getAuthenticatedHeaders(token);
    return this.http.delete(`${this.baseUrl}/usuarios/${userId}`, { headers });
  }

  getProducts(token: string): Observable<any> {
    const headers = this.getAuthenticatedHeaders(token);
    return this.http.get(`${this.baseUrl}/productos`, { headers });
  }

  createProduct(product: any, token: string): Observable<any> {
    const headers = this.getAuthenticatedHeaders(token);
    return this.http.post(`${this.baseUrl}/productos`, product, { headers });
  }

  updateProduct(product: any, token: string): Observable<any> {
    const headers = this.getAuthenticatedHeaders(token);
    return this.http.put(`${this.baseUrl}/productos/${product._id}`, product, { headers });
  }

// api.service.ts

  // Continuación...

  deleteProduct(productId: string, token: string): Observable<any> {
    const headers = this.getAuthenticatedHeaders(token);
    return this.http.delete(`${this.baseUrl}/productos/${productId}`, { headers });
  }

  getCategories(token: string): Observable<any> {
    const headers = this.getAuthenticatedHeaders(token);
    return this.http.get(`${this.baseUrl}/categorias`, { headers });
  }

  createCategory(category: any, token: string): Observable<any> {
    const headers = this.getAuthenticatedHeaders(token);
    return this.http.post(`${this.baseUrl}/categorias`, category, { headers });
  }

  updateCategory(category: any, token: string): Observable<any> {
    const headers = this.getAuthenticatedHeaders(token);
    return this.http.put(`${this.baseUrl}/categorias/${category._id}`, category, { headers });
  }

  deleteCategory(categoryId: string, token: string): Observable<any> {
    const headers = this.getAuthenticatedHeaders(token);
    return this.http.delete(`${this.baseUrl}/categorias/${categoryId}`, { headers });
  }
  search(term: string, collection: string, token: string): Observable<any> {
    const headers = this.getAuthenticatedHeaders(token);
    return this.http.get(`${this.baseUrl}/buscar/${collection}/${term}`, { headers });
  }

  private getAuthenticatedHeaders(token: string): HttpHeaders {
    return new HttpHeaders().set('Content-Type', 'application/json').set('x-token', token);
  }
}
