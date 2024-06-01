import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CosasPage } from './cosas.page';

const routes: Routes = [
  {
    path: '',
    component: CosasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CosasPageRoutingModule {}
