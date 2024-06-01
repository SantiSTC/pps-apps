import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatsLindasPage } from './stats-lindas.page';

const routes: Routes = [
  {
    path: '',
    component: StatsLindasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatsLindasPageRoutingModule {}
