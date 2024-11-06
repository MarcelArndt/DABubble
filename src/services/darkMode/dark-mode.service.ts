import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  public darkMode = true;

  constructor() {
    this.applyDarkMode();
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    this.applyDarkMode();
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  private applyDarkMode(): void {
    if (this.darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }
}
