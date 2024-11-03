import { Component, ElementRef, HostListener, Renderer2, Input} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule 
  ],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss'
})
export class SearchbarComponent {

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}

  @Input() icon: string = 'search'; 
  @Input() addClass: string[] = [];
  @Input() placeholder: string = 'Search in Devspace'; 
  @Input() align_reverse: boolean = false;

  @HostListener('focusin', ['$event'])
  onFocusIn(event: Event): void {
    const parent = this.elRef.nativeElement.querySelector('.searchbar');
    this.renderer.addClass(parent, 'active');
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: Event): void {
    const parent = this.elRef.nativeElement.querySelector('.searchbar');
    this.renderer.removeClass(parent, 'active');
  }


}
