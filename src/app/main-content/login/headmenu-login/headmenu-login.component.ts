import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-headmenu-login',
  standalone: true,
  imports: [],
  templateUrl: './headmenu-login.component.html',
  styleUrl: './headmenu-login.component.scss'
})
export class HeadmenuLoginComponent {

  @Output() eventInHead = new EventEmitter();
  sendClickToParentPageCounter(index:number = 0){
    this.eventInHead.emit(index);
  }

}
