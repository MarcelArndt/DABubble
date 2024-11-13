import { Component, ElementRef, HostListener, Renderer2, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, Validators, ReactiveFormsModule, NgControl  } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,

  ],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true
    }
  ]
})

export class InputFieldComponent implements ControlValueAccessor {
  constructor(private renderer: Renderer2, private elRef: ElementRef,) {}

  @Input() icon: string = 'star'; 
  @Input() addClass: string[] = [];
  @Input() placeholder: string = 'Your placeholder is still empty, please check your html: <app-input-field placerholder=`your placerholde`>'; 
  @Input() align_reverse: boolean = false;
  @Input() required: boolean = false;
  @Input() pattern:string = "";
  @Input() type: string = 'text';
  @Input() minlength:string = "0";
  minlenghtNumber:number = parseFloat(this.minlength);

  inputControl = new FormControl('', [Validators.required, Validators.minLength(this.minlenghtNumber)]);

  private onChange = (value: any) => {};
  private onTouched = () => {};
  public value:string = '';

  // Wird aufgerufen, wenn der Wert von außen gesetzt wird
  writeValue(value: any): void {
    this.inputControl.setValue(value, { emitEvent: false }); // Wert ohne Event-Emission setzen
  }

  // Registriert die onChange Funktion, die an das Formular weitergibt
  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.inputControl.valueChanges.subscribe(val => {
      this.value = val || '';
      fn(val); // Überträgt den Wert an das Formular
    });
  }

  // Registriert die onTouched Funktion, um zu erkennen, ob das Feld berührt wurde
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Aktiviert oder deaktiviert den Input
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.inputControl.disable() : this.inputControl.enable();
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

}