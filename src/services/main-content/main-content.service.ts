import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainContentService {

    // Use BehaviorSubject for each layer toggle to hold the current state and allow subscriptions
    private navBarIsClosedSubject = new BehaviorSubject<boolean>(true);

    private devSpaceAsTopLayer$ = new BehaviorSubject<boolean>(true);
    private chatAsTopLayer$ = new BehaviorSubject<boolean>(false);
    private threadAsTopLayer$ = new BehaviorSubject<boolean>(false);
    private threadIsOpen$ = new BehaviorSubject<boolean>(false);
  
    // Expose Observables for components to subscribe
    navBarIsClosed$: Observable<boolean> = this.navBarIsClosedSubject.asObservable();

    devSpaceAsTopLayerObs = this.devSpaceAsTopLayer$.asObservable();
    chatAsTopLayerObs = this.chatAsTopLayer$.asObservable();
    threadAsTopLayerObs = this.threadAsTopLayer$.asObservable();
    threadIsOpen = this.threadIsOpen$.asObservable();


  constructor() {
  }

  toggleNavBar() {
    const currentState = this.navBarIsClosedSubject.value; // aktuellen Zustand abrufen
    this.navBarIsClosedSubject.next(!currentState);
  }

  closeNavBar() {
    this.navBarIsClosedSubject.next(false);
  }

  openNavBar() {
    if (window.innerWidth <= 450) {
      this.navBarIsClosedSubject.next(true);
    }
  }

  openChannelForMobile(){
    this.makeChatAsTopLayer();
  }

  openThreadForMobile(){
    this.makeThreadAsTopLayer();
  }

  // Methods to update each layer’s state
  makeDevSpaceAsTopLayer() {
    this.devSpaceAsTopLayer$.next(true);
    this.chatAsTopLayer$.next(false);
    this.threadAsTopLayer$.next(false);
  }

  makeChatAsTopLayer() {
    this.threadAsTopLayer$.next(false);
    this.devSpaceAsTopLayer$.next(false);
    this.chatAsTopLayer$.next(true);
  }

  makeThreadAsTopLayer() {
    this.devSpaceAsTopLayer$.next(false);
    this.chatAsTopLayer$.next(false);
    this.threadAsTopLayer$.next(true);
  }

  displayThread(){
    this.threadIsOpen$.next(true);
  }

  hideThread(){
    this.threadIsOpen$.next(false);
  }


}
