import { Component, HostListener, Renderer2, ElementRef } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from "./searchbar/searchbar.component";
import { ProfileNavigationComponent } from "./profile-navigation/profile-navigation.component";
import { DarkModeService } from '../../../services/darkMode/dark-mode.service';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatMenuModule, CommonModule, SearchbarComponent, ProfileNavigationComponent],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss'
})
export class MainHeaderComponent {
  constructor(private renderer: Renderer2, private elRef: ElementRef, public darkmode : DarkModeService){}


}
