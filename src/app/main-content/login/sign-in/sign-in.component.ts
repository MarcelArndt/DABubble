import { Component, Output, EventEmitter } from '@angular/core';
import { InputFieldComponent } from '../../../shared/header/input-field/input-field.component';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { SignInService } from '../../../../services/sign-in/sign-in.service';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup,  signInWithEmailAndPassword } from '@angular/fire/auth';
import { timeout } from 'rxjs';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    InputFieldComponent, 
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  email: string = '';
  password: string = '';

  constructor(public auth: AuthenticationService, private router: Router, public signIn: SignInService) {}

  myFormLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  @Output() eventInSignIn = new EventEmitter();

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') event.preventDefault();
    if (this.myFormLogin.valid) this.signInUser();
  }

  sendClickToParentPageCounter(index: number = 0) {
    this.eventInSignIn.emit(index);
  }

  signInUser() {
    this.fillValues();
    this.auth.signInUser(this.email, this.password);
  }

  fillValues(){
    this.email = this.myFormLogin.value.email || '';
    this.password = this.myFormLogin.value.password || '';
  }

  async checkAlreadySignIn(){
    if(!await this.signIn.checkIsEmailAlreadyExists(this.signIn.userEmail)){
      this.sendClickToParentPageCounter(2);
    } else {
      
      this.router.navigate(['start']);
    }
  }
  async googleSignIn(){
    signInWithPopup(this.auth.auth, this.signIn.googleProvider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      this.signIn.userEmail = user.email || '';
      this.signIn.fullName = user.displayName || '';
      this.signIn.password = '';
      this.checkAlreadySignIn();
    }).catch((error) => {
    });
  }


}
