import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { provideAnimations, BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, ToastrModule.forRoot(), BrowserAnimationsModule, IonicModule.forRoot(), AppRoutingModule, provideFirebaseApp(() => initializeApp({"projectId":"pps-app-dc713","appId":"1:669058134411:web:6055f7819ff98461ea7f8e","storageBucket":"pps-app-dc713.appspot.com","apiKey":"AIzaSyDo1HDi8Ci16AqpWXSVpvsrbf9kgjhC7q0","authDomain":"pps-app-dc713.firebaseapp.com","messagingSenderId":"669058134411"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideAnimations(), provideToastr()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
