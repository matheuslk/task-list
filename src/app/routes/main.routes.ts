import { Routes } from '@angular/router';
import { HomePage } from '../features/home/home.page';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomePage,
  },
];
