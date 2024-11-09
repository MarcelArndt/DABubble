import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private auth;

  constructor() {
    this.auth = inject(Auth);
  }

  getCurrentUserId(){
    return this.auth.currentUser;
  }

}
