import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard';
import { TransactionsComponent } from './pages/transactions/transactions';
import { BudgetsComponent } from './pages/budgets/budgets';
import { SavingsComponent } from './pages/savings/savings';
import { BanksComponent } from './pages/banks/banks';
import { Login } from './pages/login/login';
import { MainLayoutComponent } from './pages/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'login', component: Login
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
  
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'transactions',
    component: TransactionsComponent
  },
  {
    path: 'budgets',
    component: BudgetsComponent
  },
  {
    path: 'savings',
    component: SavingsComponent
  },
  {
    path: 'banks',
    component: BanksComponent
  }
  ]
  },
  {
    path: '**', redirectTo: 'login'
  }
];