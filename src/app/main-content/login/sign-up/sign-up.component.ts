import { Component, EventEmitter, Output, AfterViewInit, ViewChild } from '@angular/core';
import { InputFieldComponent } from '../../../shared/header/input-field/input-field.component';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    InputFieldComponent,
    RouterModule,
    MatIcon,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})

export class SignUpComponent {

  constructor(private auth: AuthenticationService) {
  }

  @ViewChild(InputFieldComponent) childComponent!: InputFieldComponent;
  fullName: string = '';
  email: string = '';
  password: string = '';

  @Output() eventInChild = new EventEmitter();

  myForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    dataProtection: new FormControl('', [Validators.requiredTrue]),
  });

  sendClickToParentPageCounter(index: number = 0) {
    this.eventInChild.emit(index);
  }

  fillValues(){
    this.fullName = this.myForm.value.fullName || '';
    this.email = this.myForm.value.email || '';
    this.password = this.myForm.value.password || '';

  }

  registerUser() {
    this.auth.registerUser(this.email, this.password, this.fullName);
  }

  openDataProtect(){
    console.log('open a Lightbox here')
  }

  async onSubmit(pageNumber:number = 0){
    /*
    if (this.myForm.valid){
    this.fillValues();
      this.registerUser();
      this.sendClickToParentPageCounter(2);
    }
  */
    this.fillValues();
    if (await this.auth.checkIsEmailAlreadyExists(this.email)) {
      this.registerUser();
      this.sendClickToParentPageCounter(2);
      // Code, wenn die E-Mail bereits existiert
      console.log('E-Mail ist bereits registriert');
    } else {
      // Code, wenn die E-Mail nicht existiert
      console.log('E-Mail ist verfügbar');
    }
  }

}