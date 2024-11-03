import { Component } from '@angular/core';
import { MainHeaderComponent } from '../shared/header/main-header.component';
import { ChatComponent } from "./chat/chat.component";
import { ThreadComponent } from "./thread/thread.component";
import { DevspaceComponent } from "./devspace/devspace.component";


@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    MainHeaderComponent,
    ChatComponent,
    ThreadComponent,
    DevspaceComponent
],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {
}
