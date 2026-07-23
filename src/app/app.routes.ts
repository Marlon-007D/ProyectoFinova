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
import { adminGuard } from './guards/admin-guard';
import { AdminUsers } from './pages/admin-users/admin-users';

import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { SettingsComponent } from './pages/settings/settings';

export const routes: Routes = [
  {
    path: 'login', component: LoginComponent,
  },
  {
    path: 'register', component: Register,
  },
  {
    path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword)
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
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'admin/dashboard',
        component: AdminDashboard,
        canActivate: [adminGuard]
      },
      {
        path: 'admin/users',
        component: AdminUsers,
        canActivate: [adminGuard]
      }
    ]
  },
  {
    path: '**', redirectTo: 'login'
  }
];