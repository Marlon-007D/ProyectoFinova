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
}