import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [LoginGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'cosas/:atributo',
    loadChildren: () => import('./pages/cosas/cosas.module').then( m => m.CosasPageModule)
  },
  {
    path: 'perfilpropio',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'perfil/:user',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'stats',
    loadChildren: () => import('./pages/stats/stats.module').then( m => m.StatsPageModule)
  },
  {
    path: 'stats-lindas',
    loadChildren: () => import('./pages/stats-lindas/stats-lindas.module').then( m => m.StatsLindasPageModule)
  },
  {
    path: 'stats-feas',
    loadChildren: () => import('./pages/stats-feas/stats-feas.module').then( m => m.StatsFeasPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
