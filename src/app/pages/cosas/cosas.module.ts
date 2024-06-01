import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosasPageRoutingModule } from './cosas-routing.module';

import { CosasPage } from './cosas.page';
import { SpinnerModule } from 'src/app/modules/spinner/spinner.module';
import { PosteoModule } from 'src/app/modules/posteo/posteo.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CosasPageRoutingModule,
    PosteoModule,
    SpinnerModule
  ],
  declarations: [CosasPage]
})
export class CosasPageModule {}
