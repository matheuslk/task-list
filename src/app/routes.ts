import { Routes } from '@angular/router';
import { TaskListsPage } from './features/task-list/task-lists.page';
import { URLS } from './shared/data/consts/urls.const';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: URLS['TASK-LIST'],
  },
  {
    path: URLS['TASK-LIST'],
    component: TaskListsPage,
  },
  {
    path: '**',
    redirectTo: URLS['TASK-LIST'],
  },
];
