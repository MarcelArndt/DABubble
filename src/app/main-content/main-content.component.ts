import { Component } from '@angular/core';
import { MainHeaderComponent } from '../shared/header/main-header.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [ MainHeaderComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
