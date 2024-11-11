import { Component, EventEmitter, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [ MatIcon ],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {
  @Output() eventInProfil = new EventEmitter();
  sendClickToParentPageCounter(index:number = 0){
    this.eventInProfil.emit(index);
  }

  uploadImage(){
    
  }

}
