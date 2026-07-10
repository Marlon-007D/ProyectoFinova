import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard';
import { TransactionsComponent } from './pages/transactions/transactions';
import { BudgetsComponent } from './pages/budgets/budgets';
import { SavingsComponent } from './pages/savings/savings';
import { BanksComponent } from './pages/banks/banks';
import { LoginComponent } from './pages/login/login';
import { Register } from './pages/register/register';
import { MainLayoutComponent } from './pages/main-layout/main-layout';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login', component: LoginComponent,
  },
  {
    path: 'register', component: Register,
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
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