import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  mostrarFormularioEdicion: boolean = false;

  usuarios: any[] = [];
  token: string = '';
  isAdmin: boolean = false;
  newUser = {
    rol: 'ADMIN_ROLE',
    estado: true,
    google: false,
    googleAux: false, // Variable auxiliar para el campo "Google"
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
        // Actualizar la lista de usuarios después de eliminar uno
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
    this.apiService.createUser(user).subscribe(
      (response: any) => {
        console.log(response);
        // Reset newUser after creation
        this.newUser = {
          rol: 'ADMIN_ROLE',
          estado: true,
          google: false,
          googleAux: false, // Restablecer el valor de googleAux
          nombre: '',
          correo: '',
          password: ''
        };
        // Actualizar la lista de usuarios después de crear uno nuevo
        this.getUsers();
      },
      (error: any) => {
        console.error(error.error); // Imprime el mensaje de error devuelto por el servidor
      }
    );
  }

  updateUser(user: any): void {
    const token = this.authService.getToken();
    const updatedUser = { ...user }; // Copia el usuario para evitar modificar directamente el objeto original
    updatedUser.google = user.googleAux; // Actualiza el valor de "google" en la copia
    delete updatedUser.googleAux; // Elimina la propiedad "googleAux" del objeto actualizado

    console.log('Actualizando usuario con los siguientes datos:', updatedUser); // Nuevo console.log

    this.apiService.updateUser(updatedUser, token).subscribe(
      (response: any) => {
        console.log(response);
        this.selectedUser = null;
        this.mostrarFormularioEdicion = false;
        this.getUsers();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }





  cancelEditing() {
    this.selectedUser = null;
    this.mostrarFormularioEdicion = false;
  }


}
