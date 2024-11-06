import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MessagesService } from '../../../../services/messages/messages.service';

@Component({
  selector: 'app-message-images',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon
  ],
  templateUrl: './message-images.component.html',
  styleUrl: './message-images.component.scss'
})
export class MessageImagesComponent {
  @Input() message: any;
  @Input() isEdit: any

  constructor(public object: MessagesService) { }


  deleteImage(i: any) {
    this.message.attachmen.splice(i, 1);
  }
}
