import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-submenu-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './submenu-login.component.html',
  styleUrl: './submenu-login.component.scss'
})
export class SubmenuLoginComponent {
  constructor(public router: Router){}
  @Output() eventInSubMenu = new EventEmitter();
  sendClickToParentPageCounter(index:number = 0){
    this.eventInSubMenu.emit(index);
  }
  sendTo(nextPage:string = 'privacy-policy'){
    this.router.navigate(['/imprint'], { queryParams: { sendToNextPage: nextPage} });
  }
}
