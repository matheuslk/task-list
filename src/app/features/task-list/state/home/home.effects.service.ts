import { Injectable, inject } from '@angular/core';
import {
  EMPTY,
  Subject,
  catchError,
  filter,
  skip,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { TaskListService } from '../../services/task-list.service';
import { HomeStoreService } from './home.store.service';

@Injectable({
  providedIn: 'root',
})
export class HomeEffectsService {
  constructor() {
    this.taskListsListener$.subscribe();
  }

  private homeStoreService = inject(HomeStoreService);
  private taskListService = inject(TaskListService);

  private searchTaskLists$: Subject<string> = new Subject();
  private taskListsListener$ = this.searchTaskLists$.pipe(
    tap((search) => {
      this.homeStoreService.setSearch(search);
    }),
    switchMap((search) =>
      this.homeStoreService.selectTaskLists$().pipe(
        take(1),
        tap((taskLists) => {
          this.homeStoreService.setTaskLists({
            ...taskLists,
            isLoading: true,
            error: undefined,
          });
        }),
        switchMap(() =>
          this.taskListService.getTaskLists$(
            search ? { title: search } : undefined,
          ),
        ),
        tap((taskLists) => {
          this.homeStoreService.setTaskLists({
            data: taskLists,
            isLoading: false,
          });
        }),
      ),
    ),
    catchError((error) => {
      this.homeStoreService.setTaskLists({
        data: undefined,
        isLoading: false,
        error,
      });
      return EMPTY;
    }),
    takeUntil(this.homeStoreService.selectViewDestroyed$()),
  );

  getTaskLists(search = ''): void {
    this.searchTaskLists$.next(search);
  }
}
