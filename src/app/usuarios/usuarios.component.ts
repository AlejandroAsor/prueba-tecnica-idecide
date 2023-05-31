import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  mostrarFormularioEdicion: boolean = false;
  mostrarErrorCrear: boolean = false;
  mostrarErrorActualizar: boolean = false;
  erroresCrear: string[] = [];
  erroresActualizar: string[] = [];

  usuarios: any[] = [];
  token: string = '';
  isAdmin: boolean = false;
  newUser = {
    rol: 'ADMIN_ROLE',
    estado: true,
    google: false,
    googleAux: false,
    nombre: '',
    correo: '',
    password: ''
  };
  selectedUser: any = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.authService.getUserDetails().subscribe(
      (user: any) => {
        console.log(user);
        this.isAdmin = user && user.isAdmin;
        this.getUsers();
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

  deleteUser(userId: string): void {
    const token = this.authService.getToken();
    this.apiService.deleteUser(userId, token).subscribe(
      (response: any) => {
        console.log(response);
        this.getUsers();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  loadUser(usuario: any): void {
    this.selectedUser = { ...usuario };
    this.mostrarFormularioEdicion = true;
  }

  createUser(user: any): void {
    const token = this.authService.getToken();
    if (user.nombre && user.correo && user.rol && user.password) {
      this.apiService.createUser(user).subscribe(
        (response: any) => {
          console.log(response);
          this.newUser = {
            rol: 'ADMIN_ROLE',
            estado: true,
            google: false,
            googleAux: false,
            nombre: '',
            correo: '',
            password: ''
          };
          this.getUsers();
          this.mostrarErrorCrear = false;
          this.erroresCrear = [];
        },
        (error: any) => {
          console.error(error.error);
          this.mostrarErrorCrear = true;
          this.erroresCrear = Array.isArray(error.error.errors) ? error.error.errors.map((err: any) => err.msg) : [error.error];
        }
      );
    } else {
      console.error('Todos los campos obligatorios deben estar completos.');
      this.mostrarErrorCrear = true;
      this.erroresCrear = ['Todos los campos obligatorios deben estar completos.'];
    }
  }

  updateUser(user: any): void {
    const token = this.authService.getToken();
    if (user.nombre && user.correo && user.rol) {
      const updatedUser = { ...user };
      updatedUser.google = user.googleAux;
      delete updatedUser.googleAux;

      console.log('Actualizando usuario con los siguientes datos:', updatedUser);

      this.apiService.updateUser(updatedUser, token).subscribe(
        (response: any) => {
          console.log(response);
          this.selectedUser = null;
          this.mostrarFormularioEdicion = false;
          this.getUsers();
          this.mostrarErrorActualizar = false;
          this.erroresActualizar = [];
        },
        (error: any) => {
          console.error(error);
          this.mostrarErrorActualizar = true;
          this.erroresActualizar = Array.isArray(error.error) ? error.error : [error.error];
        }
      );
    } else {
      console.error('Todos los campos obligatorios deben estar completos.');
      this.mostrarErrorActualizar = true;
      this.erroresActualizar = ['Todos los campos obligatorios deben estar completos.'];
    }
  }

  cancelEditing() {
    this.selectedUser = null;
    this.mostrarFormularioEdicion = false;
    this.mostrarErrorCrear = false;
    this.mostrarErrorActualizar = false;
    this.erroresCrear = [];
    this.erroresActualizar = [];
  }
}

