// categorias.component.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];
  token: string = '';
  nuevaCategoria = {
    _id: '',
    nombre: ''
  };
  selectedCategoria: any = null;
  editing: boolean = false; // Añade esta línea

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.getCategories();
  }

  getCategories(): void {
    this.apiService.getCategories(this.token).subscribe(
      (response: any) => {
        console.log(response);
        this.categorias = response.categorias;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  createCategoria(categoria: any): void {
    const nuevaCategoria = {
      nombre: categoria.nombre
    };

    console.log('Nueva categoría a crear:', nuevaCategoria);

    const token = this.authService.getToken();

    this.apiService.createCategory(nuevaCategoria, token).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response);
        this.nuevaCategoria = {
          _id: '',
          nombre: ''
        };
        this.getCategories();
      },
      (error: any) => {
        console.error('Error al crear la categoría:', error);
        alert('Error al crear nueva categoría: Verifica tus datos');

      }
    );
  }

  updateCategoria(categoria: any): void {
    console.log('Categoría a actualizar:', categoria);

    const token = this.authService.getToken();

    const categoriaActualizada = {
      _id: categoria._id, // Mantener el mismo ID de la categoría
      nombre: categoria.nombre
    };

    console.log('Categoría actualizada:', categoriaActualizada);

    this.apiService.updateCategory(categoriaActualizada, token).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response);
        this.selectedCategoria = null;
        this.editing = false; // Añade esta línea

        this.getCategories();
      },
      (error: any) => {
        console.error('Error al actualizar la categoría:', error);
        alert('Error al actualizar la categoría: Verifica tus datos');

      }
    );
  }

  deleteCategoria(categoriaId: string): void {
    const token = this.authService.getToken();
    this.apiService.deleteCategory(categoriaId, token).subscribe(
      (response: any) => {
        console.log(response);
        this.getCategories();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  loadCategoria(categoria: any): void {
    this.selectedCategoria = { ...categoria };
    this.editing = true;

  }
  cancelEditing(): void {
    this.selectedCategoria = null;
    this.editing = false;
  }
}
