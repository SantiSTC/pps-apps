import { Injectable, inject } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytesResumable, listAll, UploadMetadata, getMetadata, StorageReference } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  uploadProgress$ = Observable<number>;
  downloadURL$ = Observable<string>;

  private storage: Storage = inject(Storage);

  user = this.auth.getUser()?.email?.split('@')[0];

  constructor( private auth: AuthService ) {}

  async subirFoto(foto: Photo, folder: string, user: any = this.user) {
    if(foto) {
      let tipo = foto.format;
      let url: any = foto.dataUrl;
      try {
        const pathArchivo = `imagenes/${folder}/${user}/${Date.now()}.${tipo}`;
        var refArchivo = ref(this.storage, pathArchivo);
        const blob = this.base64ToBlob(url, foto.format);

        const metadata: UploadMetadata = {
          customMetadata: {
            uploadedBy: user,
            uploadedAt: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
          }
        };
        
        const fotoSubida = uploadBytesResumable(refArchivo, blob, metadata);
  
        fotoSubida.on('state_changed', (snapshot) => {
          const progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Progreso de subida: ${progreso.toString()}%`);
        });
      } catch (error) {
        console.error('Error al subir la foto', error);
      } finally {
        async () => {
          console.log('Archivo subido exitosamente');
          const url = getDownloadURL(refArchivo);
          console.log('URL de la foto subida: ', url);
        }
      }
    } else {
      console.error('No se seleccionó ningún archivo');
      throw new Error('No se seleccionó ningún archivo');
    }
  }

  async obtenerFotosDelUsuario(folder: string, user: any = this.user): Promise<{url: string, uploadedBy: string, uploadedAt: string}[]> {
    try {
      const folderRef = ref(this.storage, `imagenes/${folder}/${user}`);
      const listResult = await listAll(folderRef);
      const fotos = await Promise.all(listResult.items.map(async item => {
        const url = await getDownloadURL(item);
        const metadata = getMetadata(item);
        const uploadedBy = (await metadata).customMetadata?.['uploadedBy'] || 'Unknown';
        const uploadedAt = (await metadata).customMetadata?.['uploadedAt'] || 'Unknown';
        return { url, uploadedBy, uploadedAt};
      }));
      return fotos;
    } catch (error) {
      console.error('Error al listar las fotos', error);
      throw error;
    }
  }

  async obtenerTodasLasFotos(carpeta: string): Promise<{ url: string, uploadedBy: string, uploadedAt: string }[]> {
    let fotos: { url: string, uploadedBy: string, uploadedAt: string }[] = [];

    const folderRef = ref(this.storage, `imagenes/${carpeta}`);

    const listFilesRecursively = async (ref: StorageReference) => {
      const listResult = await listAll(ref);

      const fileMetadataPromises = listResult.items.map(async item => {
        const url = await getDownloadURL(item);
        const metadata = await getMetadata(item);
        const uploadedBy = metadata.customMetadata?.['uploadedBy'] || 'Unknown';
        const uploadedAt = metadata.customMetadata?.['uploadedAt'] || 'Unknown';
        return { url, uploadedBy, uploadedAt };
      });

      const fileMetadata = await Promise.all(fileMetadataPromises);
      fotos = fotos.concat(fileMetadata);

      for (const folder of listResult.prefixes) {
        await listFilesRecursively(folder);
      }
    };

    await listFilesRecursively(folderRef);
    return fotos;
  }

  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }
}
