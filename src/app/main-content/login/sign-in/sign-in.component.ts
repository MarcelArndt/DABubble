import { Component } from '@angular/core';
import { InputFieldComponent } from '../../../shared/header/input-field/input-field.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [InputFieldComponent, RouterModule ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

}
