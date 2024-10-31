import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private app;
  private auth;

  constructor() {
    this.app = initializeApp();
    this.auth = getAuth(this.app);
  }

}
