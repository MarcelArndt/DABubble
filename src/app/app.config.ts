import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const firebaseConfig = {
  "projectId": "project-dabubble-ma",
  "appId": "1:891794878471:web:4645b847fddd5fbbe43aa2",
  "storageBucket": "project-dabubble-ma.firebasestorage.app",
  "apiKey": "AIzaSyDDTfexRUg7qWc2S-objYt5zK4PHcOY7cw",
  "authDomain": "project-dabubble-ma.firebaseapp.com",
  "messagingSenderId": "891794878471"
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()), provideAnimationsAsync(), provideAnimationsAsync()]
};