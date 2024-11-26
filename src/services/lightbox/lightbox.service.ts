import { Injectable, ViewChild, ViewContainerRef, Type, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LightboxService {

  constructor(){}

  public lightboxIsOpen:boolean = false;

  openLightBox(){
    if(!this.lightboxIsOpen) this.lightboxIsOpen = true;
  }

  closeLightBox(){
    if(this.lightboxIsOpen) this.lightboxIsOpen = false;
  }

}
