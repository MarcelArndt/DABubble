import { Component, Output, EventEmitter} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { InputFieldComponent } from '../../../shared/header/input-field/input-field.component';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { MatIcon } from '@angular/material/icon';
import { timeout } from 'rxjs';


@Component({
  selector: 'app-lost-password',
  standalone: true,
  imports: [
    InputFieldComponent,
    FormsModule,
    ReactiveFormsModule,
    MatIcon,
  ],
  templateUrl: './lost-password.component.html',
  styleUrl: './lost-password.component.scss'
})
export class LostPasswordComponent {
  constructor(public auth: AuthenticationService,){}
  myFormLostPassword = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  email:string = '';
  isSubmit:boolean = false;

  @Output() eventInLostPassword = new EventEmitter();

  sendClickToParentPageCounter(index: number = 0) {
    this.eventInLostPassword.emit(index);
  }


  sendResetMail(){
    if(this.myFormLostPassword.valid){
      this.email = this.myFormLostPassword.value.email || '';
      this.auth.resetPassword(this.email);
      this.myFormLostPassword.reset();
      this.auth.enableInfoBanner('E-Mail is sent', 'forward_to_inbox');
      this.sendClickToParentPageCounter(0);
    }
  }
}
