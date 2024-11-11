import { Component, EventEmitter, Output, AfterViewInit, ViewChild } from '@angular/core';
import { InputFieldComponent } from '../../../shared/header/input-field/input-field.component';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    InputFieldComponent,
    RouterModule,
    MatIcon,
    FormsModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})

export class SignUpComponent {
  @ViewChild(InputFieldComponent) childComponent!: InputFieldComponent;
  fullName: string = '';
  email: string = '';
  password: string = '';

  @Output() eventInChild = new EventEmitter();
  
  sendClickToParentPageCounter(index: number = 0) {
    this.eventInChild.emit(index);
  }

  constructor(private auth: AuthenticationService) { }

  fillValues(fullName:string = '', email:string='', password:string = '' ){
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.registerUser();
  }

  registerUser() {
    this.auth.registerUser(this.email, this.password, this.fullName);
  }

  
}