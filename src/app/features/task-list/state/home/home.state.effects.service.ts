import { Injectable, inject } from '@angular/core';
import { EMPTY, Subject, catchError, switchMap, take, tap } from 'rxjs';
import { TaskListService } from '../../services/task-list.service';
import { HomeStateStoreService } from './home.state.store.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class HomeStateEffectsService {
  constructor() {
    this.taskListsListener$.pipe(takeUntilDestroyed()).subscribe();
  }

  private homeStateStoreService = inject(HomeStateStoreService);
  private taskListService = inject(TaskListService);

  private searchTaskLists$: Subject<string> = new Subject();
  private taskListsListener$ = this.searchTaskLists$.pipe(
    tap((search) => {
      this.homeStateStoreService.setSearch(search);
    }),
    switchMap((search) =>
      this.homeStateStoreService.selectTaskLists$().pipe(
        take(1),
        tap((taskLists) => {
          this.homeStateStoreService.setTaskLists({
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
          this.homeStateStoreService.setTaskLists({
            data: taskLists,
            isLoading: false,
          });
        }),
      ),
    ),
    catchError((error) => {
      this.homeStateStoreService.setTaskLists({
        isLoading: false,
        error,
      });
      return EMPTY;
    }),
  );

  getTaskLists(search = ''): void {
    this.searchTaskLists$.next(search);
  }
}
