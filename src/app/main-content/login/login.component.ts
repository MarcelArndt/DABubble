import { Component } from '@angular/core';
import { LoginAnimationComponent } from './login-animation/login-animation.component';
import { LoginAnimationInsideComponent } from './login-animation-inside/login-animation-inside.component';
import { RouterModule } from '@angular/router';
import { MainContentComponent } from '../main-content.component';
import { InputFieldComponent } from '../../shared/header/input-field/input-field.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginAnimationComponent, LoginAnimationInsideComponent, RouterModule, MainContentComponent, InputFieldComponent  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss',]
})
export class LoginComponent {

}
