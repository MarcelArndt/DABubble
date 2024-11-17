import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MessagesService } from '../../../../services/messages/messages.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';


@Component({
  selector: 'app-message-name',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './message-name.component.html',
  styleUrl: './message-name.component.scss'
})
export class MessageNameComponent {
  @Input() message: any;

  constructor(
    public messageService: MessagesService,  
    public auth: AuthenticationService
  ) { }



}
