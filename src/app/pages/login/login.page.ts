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
        switch(err.code)
        {
          case 'auth/invalid-email':
            mensaje =  "Correo inválido.";
          break;
          case 'auth/missing-password':
            mensaje = "Contraseña inválida.";
          break;
          case 'auth/invalid-login-credentials':
            mensaje = 'Correo y/o contraseña incorrectos.';
          break;
          case 'auth/too-many-requests':
            mensaje = "Demasiados intentos, intente nuevamente mas tarde.";
          break;
          default: mensaje= 'Ocurrió un error. Por favor, inténtalo de nuevo.';
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
  }

}
