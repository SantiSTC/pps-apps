import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatsFeasPage } from './stats-feas.page';

const routes: Routes = [
  {
    path: '',
    component: StatsFeasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatsFeasPageRoutingModule {}
