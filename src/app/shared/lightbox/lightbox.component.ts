import { Component, ViewChild, ViewContainerRef, Type, OnDestroy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LightboxService } from '../../../services/lightbox/lightbox.service';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss'
})
export class LightboxComponent implements OnDestroy {
  constructor(public lightbox: LightboxService){}

  @ViewChild('dynamicContent', { read: ViewContainerRef, static: true })
  dynamicContent!: ViewContainerRef;

  private currentComponentRef: any;

  loadComponent<T>(component: Type<T>, inputs?: Partial<T>): void {
    const componentRef = this.dynamicContent.createComponent(component);
    this.dynamicContent.clear();
    if (inputs) {
      Object.assign(componentRef.instance!, inputs);
    }
    this.currentComponentRef = componentRef;
  }

  ngOnDestroy(): void {
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
    }
  }
}
