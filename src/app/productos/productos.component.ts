import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  productos: any[] = [];
  token: string = '';
  nuevoProducto = {
    precio: 0,
    _id: '',
    nombre: '',
    categoria: {
      _id: '',
      nombre: ''
    },
    usuario: {
      _id: '',
      nombre: ''
    }
  };
  selectedProducto: any = null;
  categorias: any[] = [];
  usuarios: any[] = [];
  categoriaSeleccionada: string = '';
  usuarioSeleccionado: string = ''; // Variable para almacenar el ID del usuario seleccionado

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.getProductos();
    this.getCategories    ();
    this.getUsers();
  }

  getProductos(): void {
    this.apiService.getProducts(this.token).subscribe(
      (response: any) => {
        console.log(response);
        this.productos = response.productos;
      },
      (error: any) => {
        console.error(error);
      }
    );
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

  getUsers(): void {
    this.apiService.getUsers(this.token).subscribe(
      (response: any) => {
        console.log(response);
        this.usuarios = response.usuarios;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  createProducto(producto: any): void {
    const nuevoProducto = {
      nombre: producto.nombre,
      categoria: this.categoriaSeleccionada,
      usuario: this.usuarioSeleccionado,
      precio: producto.precio
    };

    console.log('Nuevo producto a crear:', nuevoProducto);

    const token = this.authService.getToken();

    this.apiService.createProduct(nuevoProducto, token).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response);
        this.nuevoProducto = {
          precio: 0,
          _id: '',
          nombre: '',
          categoria: {
            _id: '',
            nombre: ''
          },
          usuario: {
            _id: '',
            nombre: ''
          }
        };
        this.getProductos();
      },
      (error: any) => {
        console.error('Error al crear el producto:', error);
        alert('Error al crear un nuevo producto: Verifica tus datos');

      }
    );
  }

  updateProducto(producto: any): void {
    console.log('Producto a actualizar:', producto);

    const token = this.authService.getToken();

    const productoActualizado = {
      _id: producto._id, // Mantener el mismo ID del producto
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: this.categoriaSeleccionada, // Pasar solo el ID de la categoría
      usuario: this.usuarioSeleccionado, // Pasar solo el ID del usuario
    };

    console.log('Producto actualizado:', productoActualizado);

    this.apiService.updateProduct(productoActualizado, token).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response);
        this.selectedProducto = null;
        this.getProductos();
      },
      (error: any) => {
        console.error('Error al actualizar el producto:', error);
        alert('Error al actualizar el producto: Verifica tus datos');

      }
    );
  }

  deleteProducto(productoId: string): void {
    const token = this.authService.getToken();
    this.apiService.deleteProduct(productoId, token).subscribe(
      (response: any) => {
        console.log(response);
        this.getProductos();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  cancelEdit(): void {
    this.selectedProducto = null;
    this.categoriaSeleccionada = '';
    this.usuarioSeleccionado = '';
  }
  loadProducto(producto: any): void {
    this.selectedProducto = { ...producto };
    this.categoriaSeleccionada = producto.categoria._id; // Actualizar el ID de la categoría seleccionada
    this.usuarioSeleccionado = producto.usuario._id; // Actualizar el ID del usuario seleccionado
  }
}

