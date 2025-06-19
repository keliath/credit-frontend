import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'new-request',
        loadComponent: () =>
          import(
            './components/new-credit-request/new-credit-request.component'
          ).then((m) => m.NewCreditRequestComponent),
        canActivate: [RoleGuard],
        data: { roles: ['User'] },
      },
      {
        path: 'my-requests',
        loadComponent: () =>
          import(
            './components/my-credit-requests/my-credit-requests.component'
          ).then((m) => m.MyCreditRequestsComponent),
        canActivate: [RoleGuard],
        data: { roles: ['User'] },
      },
      {
        path: 'requests',
        loadComponent: () =>
          import(
            './components/credit-requests-list/credit-requests-list.component'
          ).then((m) => m.CreditRequestsListComponent),
        canActivate: [RoleGuard],
        data: { roles: ['Analyst'] },
      },
    ],
  },
];
