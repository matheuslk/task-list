import { Routes } from '@angular/router';
import { URLS } from './shared/data/consts/urls.const';
import { HomePage } from './features/task-list/home.page';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: URLS['HOME'],
  },
  {
    path: URLS['HOME'],
    component: HomePage,
  },
  {
    path: '**',
    redirectTo: URLS['HOME'],
  },
];
