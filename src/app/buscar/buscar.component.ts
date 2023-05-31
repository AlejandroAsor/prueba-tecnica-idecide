import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {
  searchResults: any[];
  searchTerm: string;
  searchCollection: string;
  token: string;  // Necesitas obtener este token de algún lugar

  constructor(private apiService: ApiService) {
    this.searchResults = [];
    this.searchTerm = '';
    this.searchCollection = '';
    // debes establecer el token aquí, probablemente desde un servicio de autenticación
    this.token = '';
  }

  search(): void {
    this.searchResults = []; // Reiniciar los resultados antes de realizar una nueva búsqueda

    this.apiService.search(this.searchTerm, this.searchCollection, this.token).subscribe(
      data => {
        console.log(data);  // Imprimir la respuesta de la API
        this.searchResults = data.results; // Asignar data.results a searchResults
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  getTableColumns(): string[] {
    if (this.searchCollection === 'usuarios') {
      return ['Rol', 'Estado', 'Google', 'Nombre', 'Correo', 'UID'];
    } else if (this.searchCollection === 'productos') {
      return ['Precio', 'Nombre', 'Categoría', 'Usuario'];
    } else if (this.searchCollection === 'categorias') {
      return ['ID', 'Nombre', 'ID Usuario'];
    }
    return [];
  }
  onSearchCollectionChange(value: string): void {
    this.searchCollection = value;
    this.searchResults = []; // Reiniciar los resultados al cambiar la selección
  }



  ngOnInit(): void {
    this.searchCollection = ''; // No establecer ningún valor inicialmente
  }

}
