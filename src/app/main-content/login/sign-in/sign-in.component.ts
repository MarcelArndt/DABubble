import { Component } from '@angular/core';
import { InputFieldComponent } from '../../../shared/header/input-field/input-field.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    InputFieldComponent, 
    RouterModule,
    FormsModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  email: string = '';
  password: string = '';

  constructor(private auth: AuthenticationService, private router: Router) {}

  signInUser(email:string = '', password:string = '') {
    this.auth.signInUser(email, password);
    this.router.navigate(['start']);
  }

  signInWithGoogle() {
    this.auth.signUpWithGoogle();
    this.router.navigate(['start']);
  }

}
