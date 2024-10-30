import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const firebaseConfig = {
  "projectId": "dabubble-2a6f6",
  "appId": "1:192907769965:web:a81d0541d7297d673ea764",
  "storageBucket": "dabubble-2a6f6.appspot.com",
  "apiKey": "AIzaSyAhm5cFWdasUGKr8ujq9Mp45pCnZteW34c",
  "authDomain": "dabubble-2a6f6.firebaseapp.com",
  "messagingSenderId": "192907769965"
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())]
};
