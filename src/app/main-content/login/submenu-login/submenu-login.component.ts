import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-submenu-login',
  standalone: true,
  imports: [],
  templateUrl: './submenu-login.component.html',
  styleUrl: './submenu-login.component.scss'
})
export class SubmenuLoginComponent {
  @Output() eventInSubMenu = new EventEmitter();
  sendClickToParentPageCounter(index:number = 0){
    this.eventInSubMenu.emit(index);
  }
}
