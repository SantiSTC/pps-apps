import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import Swal from 'sweetalert2';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  imagenTomada: any;

  email: any = '';
  isAutenticated: boolean = false;
  private userSubscription: Subscription = new Subscription();

  constructor( private auth: AuthService, private router: Router, private storage: StorageService, private toast: ToastService ) {}

  preguntarTipoFoto(){
    Swal.fire({
      title: "<strong>Elije</strong>",
      icon: "info",
      html: `
        ¿Que tipo de fotos deseas subir? <br> 
        <b>Linda</b> o <b>Fea</b>,
      `,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: `
        <i class="fa fa-thumbs-up"></i> Linda
      `,
      confirmButtonAriaLabel: "Thumbs up, great!",
      cancelButtonText: `
        <i class="fa fa-thumbs-down"></i> Fea
      `,
      cancelButtonAriaLabel: "Thumbs down",
      confirmButtonColor: "#068587",
      cancelButtonColor: "#1A4F63",
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.tomarFoto('lindas');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.tomarFoto('feas');
      }
    });
  }

  async tomarFoto(folder: string) {
    try {
      const foto = await Camera.getPhoto({
        quality: 90, 
        allowEditing: false, 
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
  
      if (foto) {
        this.imagenTomada = foto;
        this.storage.subirFoto(this.imagenTomada, folder, this.email.split("@")[0]).then(() => {
          this.toast.toast('Imagen subida exitosamente');         
        }).catch((error) => {
          this.toast.toast("Error al subir la imagen");
        });
      } 
    } catch (error) {
      console.error('Error al capturar la imagen:', error);
    }
  }

  logout() {
    this.auth.logout()?.then(() => {
      this.router.navigateByUrl('login');
    });
  }

  redirectTo(url: string){
    this.router.navigateByUrl(url);
  }

  ngonInit() {
    this.isAutenticated = this.auth.isAuthenticated();
    this.userSubscription = this.auth.userActual$.subscribe(
      (user) => {
        this.isAutenticated = user ? true : false;
        this.email = user?.email;
      }
    );
    this.email = this.auth.getUser()?.email;
  }
  
}
