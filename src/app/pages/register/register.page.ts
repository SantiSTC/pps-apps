import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email: string = "";
  password: string = "";

  constructor( private auth:AuthService, private router:Router ) { }

  register() {
    this.auth.register(this.email, this.password)?.then(
      (data) => {
        Swal.fire({
          icon: "success",
          title: "Registrado correctamente!",
          showConfirmButton: false,
          timer: 1500,
          heightAuto: false,
        });

        this.router.navigateByUrl("home");
      }
    ).catch(
      (err) => {
        let mensaje;

        console.log(err);
        switch(err.code)
        {
          case 'auth/email-already-in-use':
            mensaje = 'El correo electrónico ya está registrado.';
            break;
          case 'auth/invalid-email':
            mensaje = 'El correo electrónico no es válido.';
            break;
          case 'auth/weak-password':
            mensaje = 'La contraseña es demasiado débil.';
            break;
          case 'auth/operation-not-allowed':
            mensaje = 'Esta operación no está permitida.';
            break;
          case 'auth/too-many-requests':
            mensaje = 'Demasiados intentos, intente nuevamente más tarde.';
            break;
          default:
            mensaje = 'Ocurrió un error. Por favor, inténtalo de nuevo.';
        }

        Swal.fire({
          title: "Error",
          text: mensaje,
          icon: "error",
          heightAuto: false,
        });
      }
    )
  }
  
  redirectToLogin() {
    this.router.navigateByUrl("login");
  }

  ngOnInit() {
    console.log("Register Iniciado");
  }

  fastLogin(email: string, password: string) {
    this.auth.login(email, password)?.then(
      (data) => {
        this.router.navigateByUrl("home");
      }
    );
  }

}
