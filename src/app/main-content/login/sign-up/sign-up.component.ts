import { Component, EventEmitter, Output } from '@angular/core';
import { InputFieldComponent } from '../../../shared/header/input-field/input-field.component';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [InputFieldComponent, RouterModule, MatIcon ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  @Output() eventInChild = new EventEmitter();
  sendClickToParentPageCounter(index:number = 0){
    this.eventInChild.emit(index);
  }

  
}
