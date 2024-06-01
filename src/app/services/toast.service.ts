import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async toast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duración en milisegundos
      position: 'bottom' // Posición del toast
    });

    toast.present();
  }
}