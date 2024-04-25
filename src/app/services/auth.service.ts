import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  email: string = "";
  constructor(private auth:Auth) { }

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
    return this.auth.currentUser;
  }

}
