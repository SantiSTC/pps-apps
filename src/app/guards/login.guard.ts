import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

function constructor(private0: any, authService: any, AuthService: any, private1: any, router: any, Router: any) {
  throw new Error('Function not implemented.');
}

function canActivate(route: ActivatedRouteSnapshot, ActivatedRouteSnapshot: any, state: RouterStateSnapshot, RouterStateSnapshot: any) {
  throw new Error('Function not implemented.');
}

