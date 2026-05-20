import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {

  public lineChartData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [
      {
        data: [1200, 1900, 3000, 2500, 4200],
        label: 'Gastos',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  public lineChartOptions = {
    responsive: true
  };

  public lineChartType: 'line' = 'line';

}