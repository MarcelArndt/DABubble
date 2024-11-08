import { Component, EventEmitter, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-success-creating-account',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './success-creating-account.component.html',
  styleUrl: './success-creating-account.component.scss'
})
export class SuccessCreatingAccountComponent {
  @Output() eventInSuccess = new EventEmitter();
  sendClickToParentPageCounter(index:number = 0){
    this.eventInSuccess.emit(index);
  }
}
