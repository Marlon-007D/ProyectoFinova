import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  isDark = false;

  constructor() {

    const savedTheme =
      localStorage.getItem('theme');

    this.isDark = savedTheme === 'dark';

    this.updateTheme();
  }

  toggleTheme() {

    this.isDark = !this.isDark;

    localStorage.setItem(
      'theme',
      this.isDark ? 'dark' : 'light'
    );

    this.updateTheme();
  }

  updateTheme() {
    if(this.isDark){
      document.documentElement.classList.add('dark');
    }else{
      document.documentElement.classList.remove('dark');
    }
  }

  applyPreferences(fontSize: string, fontFamily: string) {
    // Apply font size
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    if (fontSize === 'small') document.documentElement.classList.add('text-sm');
    else if (fontSize === 'large') document.documentElement.classList.add('text-lg');
    else document.documentElement.classList.add('text-base');

    // Apply font family using important on body
    if (fontFamily === 'Inter') {
      document.body.style.setProperty('font-family', '"Inter", sans-serif', 'important');
    } else if (fontFamily === 'Roboto') {
      document.body.style.setProperty('font-family', '"Roboto", sans-serif', 'important');
    } else if (fontFamily === 'Monospace') {
      document.body.style.setProperty('font-family', 'monospace', 'important');
    }
  }
}