import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-profile-navigation',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatMenuModule,
    MatIcon
  ],
  templateUrl: './profile-navigation.component.html',
  styleUrl: './profile-navigation.component.scss'
})
export class ProfileNavigationComponent {

}
