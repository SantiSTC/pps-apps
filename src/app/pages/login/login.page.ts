import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = "";
  password: string = "";

  constructor( private auth:AuthService, private router:Router ) { }

  login() {
    this.auth.login(this.email, this.password)?.then(
      (data) => {
        this.router.navigateByUrl("home");
      }
    ).catch(
      (err) => {
        let mensaje;

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

        Swal.fire({
          title: "Error",
          text: mensaje,
          icon: "error",
          heightAuto: false,
        });
      }
    );
  }

  redirectToRegister() {
    this.router.navigateByUrl("register");
  }

  ngOnInit() {
    console.log("Login Iniciado");
  }

}
