import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PosteoComponent } from 'src/app/components/posteo/posteo.component';
import { StorageService } from 'src/app/services/storage.service';
import { IonContent } from "@ionic/angular/standalone";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ToastService } from 'src/app/services/toast.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cosas',
  templateUrl: './cosas.page.html',
  styleUrls: ['./cosas.page.scss'],
})
export class CosasPage implements OnInit {
  atributo: string = ''; 
  fotos: {url: string, uploadedBy: string, uploadedAt: string }[] = [];

  email: any = '';
  isAutenticated: boolean = false;
  private userSubscription: Subscription = new Subscription();

  imagenTomada: any;

  spinner: boolean = false;
  
  constructor( private router: Router, private auth: AuthService, private storage: StorageService, private route: ActivatedRoute, private toast: ToastService ) { }

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

  redirectTo(url: string){
    this.router.navigateByUrl(url);
  }

  ngOnInit() { 
    this.spinner = true;

    this.route.params.subscribe(params => {
      this.atributo = params['atributo'];

      if(this.atributo !== 'lindas' && this.atributo !== 'feas'){
        this.spinner = false;
        this.router.navigate(['/home']);
      }
    });

    this.isAutenticated = this.auth.isAuthenticated();
    this.userSubscription = this.auth.userActual$.subscribe(
      (user) => {
        this.isAutenticated = user ? true : false;
        this.email = user?.email;
      }
    );
    
    this.storage.obtenerTodasLasFotos(this.atributo).then( fotos => {
      this.fotos = this.ordenarFotosPorFecha(fotos);
      setTimeout(() => {
        this.spinner = false;
      }, 1000);
    }).catch( error => {
      console.error('Error al obtener las fotos: ', error);
    });
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
