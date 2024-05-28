import { Routes } from '@angular/router';
import { ROUTES } from './core/data/consts/routes.const';
import { HomePage } from './features/task-list/home.page';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ROUTES['HOME'],
  },
  {
    path: ROUTES['HOME'],
    component: HomePage,
  },
  {
    path: '**',
    redirectTo: ROUTES['HOME'],
  },
];
