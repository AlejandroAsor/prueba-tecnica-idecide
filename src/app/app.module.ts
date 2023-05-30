import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ProductosComponent } from './productos/productos.component';
import { LoginComponent } from './login/login.component';

// Importa AuthService
import { AuthService } from './core/services/auth.service';
import { BuscarComponent } from './buscar/buscar.component';
import { HeaderComponent } from './header/header.component';
import { InicioComponent } from './inicio/inicio.component';

@NgModule({
  declarations: [
    AppComponent,
    UsuariosComponent,
    CategoriasComponent,
    ProductosComponent,
    LoginComponent,
    BuscarComponent,
    HeaderComponent,
    InicioComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [AuthService], // Añade AuthService a la lista de proveedores
  bootstrap: [AppComponent]
})
export class AppModule { }
