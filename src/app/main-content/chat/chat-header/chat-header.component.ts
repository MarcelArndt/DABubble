import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss'
})
export class ChatHeaderComponent {


  openDialog() {

  }
}
