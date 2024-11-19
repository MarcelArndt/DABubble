import { Component, EventEmitter, Output, AfterViewInit, ViewChild } from '@angular/core';
import { InputFieldComponent } from '../../../shared/header/input-field/input-field.component';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule, AbstractControl, AsyncValidatorFn, ValidationErrors, FormBuilder } from '@angular/forms';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    InputFieldComponent,
    RouterModule,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    CommonModule 
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})


export class SignUpComponent {

  myForm: FormGroup

  constructor(private auth: AuthenticationService, private fb: FormBuilder) {
    this.myForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email], [this.emailAsyncValidator()]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      dataProtection: ['', [Validators.requiredTrue]]
    });
  }

  @ViewChild(InputFieldComponent) childComponent!: InputFieldComponent;
  fullName: string = '';
  email: string = '';
  password: string = '';

  @Output() eventInChild = new EventEmitter();



  sendClickToParentPageCounter(index: number = 0) {
    this.eventInChild.emit(index);
  }

  emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return of(control.value).pipe(
        debounceTime(300), // optional, um Anfragen zu minimieren
        switchMap(email => 
          this.auth.checkIsEmailAlreadyExists(email).then(
            exists => (exists ? { emailExists: true } : null)
          )
        ),
        catchError(() => of(null))
      );
    };
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

checkForEmail(){
  this.fillValues();
  this.sendClickToParentPageCounter(2);
}

async onSubmit(pageNumber:number = 0){
  if (this.myForm.valid){
  this.fillValues();
  this.sendClickToParentPageCounter(2);
  this.registerUser();
  }
}

}