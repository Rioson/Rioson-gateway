import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' }
];
