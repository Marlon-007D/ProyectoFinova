import { Component } from '@angular/core';
import savingsData from './savings.json';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-savings',
  imports: [NgClass],
  templateUrl: './savings.html',
  styleUrl: './savings.css',
})
export class SavingsComponent {
  goals = savingsData.goals;
}
