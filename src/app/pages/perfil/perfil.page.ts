import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Subscription } from 'rxjs';
import { PosteoComponent } from 'src/app/components/posteo/posteo.component';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  perfil: string = '';

  fotos: {url: string, uploadedBy: string, uploadedAt: string }[] = [];
  imagenTomada: any;

  email: any = '';
  isAuthenticated: boolean = false;
  private userSubscription: Subscription = new Subscription();

  spinner: boolean = false;

  constructor( private router: Router, private storage: StorageService, private toast: ToastService, private auth: AuthService, private route: ActivatedRoute ) { }

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
        this.storage.subirFoto(this.imagenTomada, folder, this.perfil).then(() => {
          this.toast.toast('Imagen subida exitosamente');         
        }).catch((error) => {
          this.toast.toast("Error al subir la imagen");
        });
      } 
    } catch (error) {
      console.error('Error al capturar la imagen:', error);
    }
  }

  redirectTo(url: string){
    this.router.navigateByUrl(url);
  }

  ngOnInit() {
    this.spinner = true;

    this.isAuthenticated = this.auth.isAuthenticated();
    this.userSubscription = this.auth.userActual$.subscribe(
      (user) => {
        this.isAuthenticated = user ? true : false;
        this.email = user?.email;
        this.perfil = user?.email?.split('@')[0] as string;
      }
    );

    this.route.params.subscribe(params => {
      if(params['user']){
        this.perfil = params['user'];
      }
    });

    this.storage.obtenerFotosDelUsuario("lindas", this.perfil).then( fotos => {
      this.fotos = fotos;
      this.fotos = this.ordenarFotosPorFecha(this.fotos);
    }).catch( error => {
      console.error('Error al obtener las fotos: ', error);
    });

    this.storage.obtenerFotosDelUsuario("feas", this.perfil).then( fotosFeas => {
      this.fotos.concat(fotosFeas);
      this.fotos = this.ordenarFotosPorFecha(this.fotos);

      setTimeout(() => {
        this.spinner = false;
      }, 1000);
    })
  }

  private ordenarFotosPorFecha(fotos: { url: string, uploadedBy: string, uploadedAt: string }[]): { url: string, uploadedBy: string, uploadedAt: string }[] {
    return fotos.sort((a, b) => {
      const dateA = this.convertStringToDate(a.uploadedAt);
      const dateB = this.convertStringToDate(b.uploadedAt);
      return dateB.getTime() - dateA.getTime(); // Orden descendente
    });
  }

  private convertStringToDate(dateString: string): Date {
    const [day, month, year, hours, minutes, seconds] = dateString.split(/[/ :]/);
    return new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
  }

}
