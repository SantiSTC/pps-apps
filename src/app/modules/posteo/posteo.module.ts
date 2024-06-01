import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosteoComponent } from 'src/app/components/posteo/posteo.component';

@NgModule({
  declarations: [PosteoComponent],
  imports: [
    CommonModule
  ],
  exports: [PosteoComponent],
})
export class PosteoModule { }