
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = "";
  password: string = "";

  spinner: boolean = false;
  acceso: boolean = false;

  constructor( private auth:AuthService, private router:Router ) { }

  login() {
    this.auth.login(this.email, this.password)?.then(
      (data:any) => {
        this.spinner = true;
        setTimeout(() => {
          this.spinner = false;
          this.router.navigateByUrl("home");
        }, 1500);
      }
    ).catch(
      (err:any) => {
        let mensaje: string;

        console.log(err);
        switch(err.code) {
          case 'auth/invalid-email':
            mensaje = "Correo inválido.";
            break;
          case 'auth/user-disabled':
            mensaje = "Este usuario ha sido deshabilitado.";
            break;
          case 'auth/user-not-found':
            mensaje = "No se encontró ningún usuario con este correo.";
            break;
          case 'auth/wrong-password':
            mensaje = "Contraseña incorrecta.";
            break;
          case 'auth/invalid-credential':
            mensaje = "Credenciales de autenticación inválidas.";
            break;
          case 'auth/too-many-requests':
            mensaje = "Demasiados intentos, intente nuevamente más tarde.";
            break;
          default:
            mensaje = err + "    Ocurrió un error. Por favor, inténtalo de nuevo.";
        }

        this.spinner = true;
        setTimeout(() => {
          this.spinner = false;
          Swal.fire({
            title: "Error",
            text: mensaje,
            icon: "error",
            heightAuto: false,
          })
        }, 1500);

      }
    );
  }

  fastLogin(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  ngOnInit() {
    console.log("Login Iniciado");
  }

}
