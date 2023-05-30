import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  username: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getUsername();
  }

  getUsername(): void {
    // this.authService.getUserName().subscribe(
    //   (response: any) => {
    //     console.log('InicioComponent getUsername response:', response);
    //     this.username = response.nombre;
    //   },
    //   (error: any) => {
    //     console.log('InicioComponent getUsername error:', error);
    //   }
    // );
  }

}
