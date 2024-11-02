import { Component } from '@angular/core';
import { LoginAnimationComponent } from './login-animation/login-animation.component';
import { RouterModule } from '@angular/router';
import { MainContentComponent } from '../main-content.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginAnimationComponent, RouterModule, MainContentComponent ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
