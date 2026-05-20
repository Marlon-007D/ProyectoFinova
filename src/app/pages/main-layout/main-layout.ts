import { Component } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, RouterLink], 
  templateUrl: './main-layout.html'
})
export class MainLayoutComponent {
  isMenuOpen: boolean = false;
}