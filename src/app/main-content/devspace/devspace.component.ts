import { CommonModule } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTreeModule} from '@angular/material/tree';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CreateChannelComponent } from '../../dialog/create-channel/create-channel.component';


@Component({
  selector: 'app-devspace',
  standalone: true,
  imports: [
    MatSidenavModule,
    CommonModule,
    MatButtonModule,
    MatIcon,
    MatTreeModule,
    MatDialogModule
  ],
  templateUrl: './devspace.component.html',
  styleUrl: './devspace.component.scss',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }), // Initial state: hidden and collapsed
        animate('125ms ease-out', style({ height: '*', opacity: 1 })) // Animate to visible and full height
      ]),
      transition(':leave', [
        animate('125ms ease-in', style({ height: 0, opacity: 0, overflow: 'hidden' })) // Animate to hidden and collapsed
      ])
    ])
  ]
})
export class DevspaceComponent {
  navBarIsClosed: boolean = false;
  contactsAreVisible: boolean = true;
  channelsAreVisible: boolean = true;
  readonly dialog = inject(MatDialog);


  closeNavBar() { 
    this.navBarIsClosed = !this.navBarIsClosed;
  }


  dropChannels(){
    this.channelsAreVisible = !this.channelsAreVisible;
  }

  dropContacts(){
    this.contactsAreVisible = !this.contactsAreVisible;
  }

  openCreateChannelDialog(){
    const dialogRef = this.dialog.open(CreateChannelComponent);
    dialogRef.afterClosed().subscribe();
  }
}