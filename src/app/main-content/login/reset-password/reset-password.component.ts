import { Component, Output, EventEmitter} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { InputFieldComponent } from '../../../shared/header/input-field/input-field.component';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    InputFieldComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  constructor(public auth:AuthenticationService){
  }

    myFormResetPassword = new FormGroup({
      setNewPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    });

    @Output() eventInResetPassword= new EventEmitter();

    sendClickToParentPageCounter(index: number = 0) {
      this.eventInResetPassword.emit(index);
    }
    
    setNewPassword(){
      if(this.myFormResetPassword.value){
        console.log('new Password is on saveing');
        this.auth.saveNewPassword(this.myFormResetPassword.value.confirmPassword as string).then(() => {
          console.log( console.log('Password is saved'));
          console.log('Prozess comes to end');
        });
      }
    }

}
