import { Injectable } from '@angular/core';
import { User, Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  email: string = "";

  private userObj: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null); 

  userActual$ = this.userObj.asObservable();

  constructor( private auth: Auth ) {
    this.auth.onAuthStateChanged((user) => {
      this.userObj.next(user);
    });
   }

  login(email: string, password: string) {
    let ret;

    try {
      this.email = email;
      ret = signInWithEmailAndPassword(this.auth, email, password);
    } catch (e) {
      console.log(e);
      ret = null;
    }

    return ret;
  }

  logout() {
    let ret;

    try {
      ret = signOut(this.auth);
      this.email = "";
    } catch (e) {
      console.log(e);
      ret = null;
    }

    return ret;
  }

  register(email: string, password: string) {
    let ret;

    try {
      ret = createUserWithEmailAndPassword(this.auth, email, password);
    } catch (e) {
      console.log(e);
      ret = null;
    }

    return ret;
  }

  getUser() {
    return this.userObj.value;
  }

  isAuthenticated(): boolean {
    return this.email !== "";
  }
}
