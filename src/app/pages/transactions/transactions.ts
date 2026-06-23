import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import transactionsData from './transactions.json';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class TransactionsComponent {

  transactions = transactionsData.transactions;

}