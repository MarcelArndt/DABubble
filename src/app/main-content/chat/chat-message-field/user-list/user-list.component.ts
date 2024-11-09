import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, input, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  @Input() messageField: any
  @Input() users: any
  showUserList: boolean = false;
  filteredUsers: string[] = [];
  selectedIndex = -1;
 
}
