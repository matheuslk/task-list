import { Routes } from '@angular/router';
import { HomePage } from '../features/home/home.page';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'listas',
  },
  {
    path: 'listas',
    component: HomePage,
  },
  {
    path: 'lista/:id',
    component: HomePage,
  },
];
