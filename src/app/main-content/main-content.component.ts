import { Component } from '@angular/core';
import { MainHeaderComponent } from '../shared/header/main-header.component';
import { ChatComponent } from "./chat/chat.component";
import { ThreadComponent } from "./thread/thread.component";
import { DevspaceComponent } from "./devspace/devspace.component";
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ChannelService } from '../../services/channel/channel.service';
import { CommonModule } from '@angular/common';
import { MainContentService } from '../../services/main-content/main-content.service';


@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    MainHeaderComponent,
    ChatComponent,
    ThreadComponent,
    DevspaceComponent,
    CommonModule
],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

  devSpaceAsTopLayer: boolean = false;
  chatAsTopLayer: boolean = false;
  threadAsTopLayer: boolean = false;
  threadIsOpen: boolean = false;

  constructor(private auth: AuthenticationService, private mainContentService: MainContentService) {
    auth.observerUser();
  }

  ngOnInit() {
    this.mainContentService.devSpaceAsTopLayerObs.subscribe(value => {
      this.devSpaceAsTopLayer = value;
    });
    this.mainContentService.chatAsTopLayerObs.subscribe(value => {
      this.chatAsTopLayer = value;
    });
    this.mainContentService.threadAsTopLayerObs.subscribe(value => {
      this.threadAsTopLayer = value;
    });
    this.mainContentService.threadIsOpen.subscribe(value => {
      this.threadIsOpen = value;
    });
  }


}
