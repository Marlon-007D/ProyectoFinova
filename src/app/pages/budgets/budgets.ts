import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

import budgetsData from './budgets.json';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [NgClass],
  templateUrl: './budgets.html',
  styleUrl: './budgets.css'
})
export class BudgetsComponent {

  budgets = budgetsData;

}