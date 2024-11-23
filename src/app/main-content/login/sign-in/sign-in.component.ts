import { Component, Output, EventEmitter } from '@angular/core';
import { InputFieldComponent } from '../../../shared/header/input-field/input-field.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { SignInService } from '../../../../services/sign-in/sign-in.service';


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

  constructor(private auth: AuthenticationService, private router: Router, private signIn: SignInService) {}

  myFormLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  @Output() eventInSignIn = new EventEmitter();

  sendClickToParentPageCounter(index: number = 0) {
    this.eventInSignIn.emit(index);
  }

  signInUser() {
    this.fillValues();
    this.signIn.checkForSignIn(this.email, this.password);
  }

  fillValues(){
    this.email = this.myFormLogin.value.email || '';
    this.password = this.myFormLogin.value.password || '';
  }

  async signInWithGoogle() {
    //this.auth.signUpWithGoogle();
   await this.signIn.signInWithGoogle();
  }

}
