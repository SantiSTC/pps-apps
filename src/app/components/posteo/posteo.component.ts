import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-posteo',
  templateUrl: './posteo.component.html',
  styleUrls: ['./posteo.component.scss'],
})
export class PosteoComponent  implements OnInit {
  @Input() url: string = "";
  @Input() duenio: string = "";
  @Input() fecha: string = "";

  fechaAMostrar: string = "";

  votado: boolean = false;
  like!: boolean;

  votos: any = [];  
  fotos: any = [];
  fotosfeas: any = [];
  likes: any = [];

  constructor( private router: Router, private firestore: FirestoreService, private auth: AuthService, private storage: StorageService ) { }

  votar(){
    this.like = !this.like;

    if(!this.votado) {
      this.guardarVoto();
      this.votado = true;
    } else {
      this.modificarVoto();
    }
  }

  guardarCantidadLikes(fotos:any){
    fotos.forEach((element:any) => {
      let existe = false;
      let index = -1;

      let obj = {
        url: element.url,
        duenio: element.uploadedBy,
        likes: 0,
        atributo: element.url.split("%2F")[1],
      };

      this.votos.forEach((item:any) => {
        if(element.url === item.url){
          obj.likes ++;
        }
      })
      
      for(let i=0; i<this.likes.length; i++){
        if(this.likes[i].url === element.url){
          existe = true;
          index = i;
          break;
        }
      }

      if(existe && index > -1) {
        this.likes[index].likes = obj.likes;
        this.firestore.actualizar("likes", this.likes[index]);
      } else {
        this.firestore.guardar("likes", obj);
      }
    })
  }

  guardarVoto(){
    let obj = {
      url: this.url,
      like: this.like,
      atributo: this.url.split("%2F")[1],
      duenio: this.duenio,
      votante: this.auth.getUser()?.email,
    };

    this.firestore.guardar("votos", obj).then(() => {
      if(obj.atributo !== "feas") {
        this.guardarCantidadLikes(this.fotos);
      } else {
        this.guardarCantidadLikes(this.fotosfeas);
      }
    });
  }

  modificarVoto(){
    let obj = {
      url: this.url,
      like: this.like,
      atributo: this.url.split("/")[4],
      duenio: this.duenio,
      votante: this.auth.getUser()?.email,
    };

    this.firestore.actualizar("votos", obj);
  }

  traerVotos(){
    this.firestore.traer("votos").subscribe((votos) => {
      this.votos = votos;
      let voto = votos.find((voto: { url: string; votante: string; }) => voto.url === this.url && voto.votante === this.auth.getUser()?.email);

      if(voto){
        if(voto.votante === this.auth.getUser()?.email) {
          this.like = voto.like;
          this.votado = true;
        } else {
          this.votado = false;
        }
      } else {
        this.votado = false;
      }
    });
  }

  ngOnInit() {
    this.traerVotos();

    if(this.fecha.split(" ")[0] == new Date().toLocaleDateString()){
      this.fechaAMostrar = this.fecha.split(" ")[1];
    } else {
      this.fechaAMostrar = this.fecha.split(" ")[0];;
    }

    //------------------------------------------------------

    this.storage.obtenerTodasLasFotos("lindas").then( fotos => {
      this.fotos = fotos;
    }).catch( error => {
      console.error('Error al obtener las fotos: ', error);
    });

    //------------------------------------------------------

    this.storage.obtenerTodasLasFotos("feas").then( fotos => {
      this.fotosfeas = fotos;
    }).catch( error => {
      console.error('Error al obtener las fotos: ', error);
    });

    //------------------------------------------------------

    this.firestore.traer("likes").subscribe((likes) => {
      this.likes = likes;
    });

  }

  ngOnDestroy(): void {
    this.firestore.traer("votos").subscribe().unsubscribe();
    this.firestore.traer("likes").subscribe().unsubscribe();
  }

  redirectToPerfil(){
    let path = "perfil/" + this.duenio;
    console.log('Redirigiendo a: ', path)
    this.router.navigateByUrl(path);
  }
}
