import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DarkModeService } from '../../../../services/darkMode/dark-mode.service';

@Component({
  selector: 'app-profile-navigation',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatMenuModule,
    MatIcon,
    RouterModule,
  ],
  templateUrl: './profile-navigation.component.html',
  styleUrl: './profile-navigation.component.scss'
})
export class ProfileNavigationComponent {
  constructor(public darkMode: DarkModeService) { }

  toInnerHTML = '';
  sizeThreshold = 1285;
  currentImgPath = './img/profil-pic/006.svg'
  switchMobilOn = false

  toggleTheme() {
    this.darkMode.toggleDarkMode();
  }

  isDarkMode(): boolean {
    return this.darkMode.isDarkMode();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    let windowWidth = window.innerWidth;
    this.toInnerHTML = windowWidth < this.sizeThreshold ? `<mat-icon> keyboard_arrow_down </mat-icon>` : `<img src="${this.currentImgPath}">`;
    this.switchMobilOn = windowWidth < this.sizeThreshold ? false : true;
  }

  ngOnInit(){
    let windowWidth = window.innerWidth;
    this.switchMobilOn = windowWidth < this.sizeThreshold ? false : true;
  }

}
