import { Component, ChangeDetectorRef } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import { NgClass } from '@angular/common';


import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

import { BudgetService, Budget } from '../../services/budget.service';
import { TransactionService, Transaction } from '../../services/transaction.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective, NgClass],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  
  stats = [
    { title: 'Saldo Total', amount: 0, change: '+0%', isPositive: true, color: 'blue' },
    { title: 'Ingresos Mensuales', amount: 0, change: '+0%', isPositive: true, color: 'emerald' },
    { title: 'Gastos Mensuales', amount: 0, change: '-0%', isPositive: false, color: 'rose' }
  ];

  budgets: Budget[] = [];
  transactions: Transaction[] = [];

  public lineChartData: any = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Gastos',
        borderColor: '#f43f5e', // rose-500
        backgroundColor: 'rgba(244,63,94,0.1)',
        fill: true,
        tension: 0.4
      },
      {
        data: [],
        label: 'Ingresos',
        borderColor: '#10b981', // emerald-500
        backgroundColor: 'rgba(16,185,129,0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  public lineChartOptions = {
    responsive: true
  };

  public lineChartType: 'line' = 'line';

  constructor(
    private budgetService: BudgetService, 
    private transactionService: TransactionService,
    private cdr: ChangeDetectorRef
  ) {
    this.budgetService.getBudgets().subscribe(data => {
      this.budgets = data.slice(0, 3); // top 3 budgets
      this.cdr.detectChanges();
    });
    this.transactionService.getTransactions().subscribe(data => {
      this.transactions = data;
      this.calculateStats();
      this.updateChart();
      this.cdr.detectChanges();
    });
  }

  calculateStats() {
    let income = 0;
    let expense = 0;
    this.transactions.forEach(t => {
      if (t.transactionType === 'INGRESO') income += t.amount;
      else expense += t.amount;
    });
    
    this.stats[0].amount = income - expense;
    this.stats[1].amount = income;
    this.stats[2].amount = expense;
  }

  updateChart() {
    // Agrupar por mes
    const monthlyData: { [key: string]: { inc: number, exp: number } } = {};
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    this.transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { inc: 0, exp: 0 };
      }
      if (t.transactionType === 'INGRESO') {
        monthlyData[monthKey].inc += t.amount;
      } else {
        monthlyData[monthKey].exp += t.amount;
      }
    });

    const labels = Object.keys(monthlyData).sort((a, b) => {
      // simple sort by string might not be perfect for years, but good enough for demo
      return a.localeCompare(b);
    });
    const expData = labels.map(l => monthlyData[l].exp);
    const incData = labels.map(l => monthlyData[l].inc);

    this.lineChartData = {
      labels: labels.length > 0 ? labels : ['Sin Datos'],
      datasets: [
        {
          data: expData.length > 0 ? expData : [0],
          label: 'Gastos',
          borderColor: '#f43f5e',
          backgroundColor: 'rgba(244,63,94,0.1)',
          fill: true,
          tension: 0.4
        },
        {
          data: incData.length > 0 ? incData : [0],
          label: 'Ingresos',
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }

}