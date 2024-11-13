import { Component } from '@angular/core';
import { InputFieldComponent } from '../../../shared/header/input-field/input-field.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';


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

  constructor(private auth: AuthenticationService, private router: Router) {}


  myFormLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  signInUser() {
    this.fillValues();
    this.auth.signInUser(this.email, this.password);
    this.router.navigate(['start']);
  }

  fillValues(){
    this.email = this.myFormLogin.value.email || '';
    this.password = this.myFormLogin.value.password || '';
  }

  signInWithGoogle() {
    this.auth.signUpWithGoogle();
    this.router.navigate(['start']);
  }

}
