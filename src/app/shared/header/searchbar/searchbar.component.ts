import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss'
})
export class SearchbarComponent {

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}

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
