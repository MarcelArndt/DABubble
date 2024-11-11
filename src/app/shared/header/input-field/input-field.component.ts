import { Component, ElementRef, HostListener, Renderer2, Input, Output, EventEmitter} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss'
})
export class InputFieldComponent {
  constructor(private renderer: Renderer2, private elRef: ElementRef,) {}

  @Output() eventInChild = new EventEmitter();
  @Input() icon: string = 'star'; 
  @Input() addClass: string[] = [];
  @Input() placeholder: string = 'Your placeholder is still empty, please check your html: <app-input-field placerholder=`your placerholde`>'; 
  @Input() align_reverse: boolean = false;
  @Input() required: boolean = false;
  @Input() pattern: string | null = null;

  public value:string = '';
  inputControl: FormControl = new FormControl('');

  sendOutputValueToParent() {
    this.eventInChild.emit(this.value);
  }

  @HostListener('focusin', ['$event'])
  onFocusIn(event: Event): void {
    const parent = this.elRef.nativeElement.querySelector('.custom-input');
    this.renderer.addClass(parent, 'active');
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: Event): void {
    const parent = this.elRef.nativeElement.querySelector('.custom-input');
    this.renderer.removeClass(parent, 'active');
  }

  getValue(){
    return this.value;
  }

  ngOnInit() {
    let validators = [];
    if (this.required) validators.push(Validators.required);
    if (this.pattern) validators.push(Validators.pattern(this.pattern));
    this.inputControl = new FormControl('', validators);
  }
}