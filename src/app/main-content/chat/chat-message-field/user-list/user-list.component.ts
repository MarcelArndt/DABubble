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
  @ViewChild('userListContainer') userListContainer!: ElementRef;


  selectUser(user: any) {
    const lastAtSignIndex = this.messageField.lastIndexOf('@');
    this.messageField = this.messageField.substring(0, lastAtSignIndex + 1) + user + ' ';
    this.showUserList = false;
    this.selectedIndex = -1;
  }

  addTag() {
    this.messageField += '@';
    this.showUserList = true;
    this.filteredUsers = this.users; 
  }


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.showUserList) return;

    if (event.key === 'ArrowDown') {
      this.selectedIndex = (this.selectedIndex + 1) % this.filteredUsers.length;
      this.scrollToSelected();
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.selectedIndex = (this.selectedIndex - 1 + this.filteredUsers.length) % this.filteredUsers.length;
      this.scrollToSelected();
      event.preventDefault();
    } else if (event.key === 'Enter' && this.selectedIndex >= 0) {
      this.selectUser(this.filteredUsers[this.selectedIndex]);
      event.preventDefault();
    } else if (event.key === ' ') {  // Leerzeichen schließt die Liste
      this.showUserList = false;
    }
  }

  private scrollToSelected() {
    setTimeout(() => {
      const items = this.userListContainer.nativeElement.querySelectorAll('li');
      if (items[this.selectedIndex]) {
        items[this.selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 0);
  }
}
