import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ITaskListsResponse } from '../../data/interfaces/task-list.interface';
import { TaskListService } from '../../services/task-list.service';
import { HomeStateStoreService } from './home.state.store.service';

@Injectable()
export class HomeStateEffectsService {
  constructor() {
    this.taskListsListener$.subscribe();
  }

  private homeStateStoreService = inject(HomeStateStoreService);
  private taskListService = inject(TaskListService);

  private getTaskLists$: Subject<void> = new Subject();
  private taskListsListener$ = this.getTaskLists$.pipe(
    switchMap(() =>
      this.homeStateStoreService.selectTaskLists$().pipe(
        take(1),
        tap((taskListsState) => {
          this.homeStateStoreService.setTaskLists({
            data: taskListsState.data,
            isLoading: true,
          });
        }),
        switchMap(() => this.fetchTaskLists$()),
        catchError((error) => {
          this.homeStateStoreService.setTaskLists({
            isLoading: false,
            error,
          });
          return EMPTY;
        }),
      ),
    ),
    takeUntilDestroyed(),
  );

  // Helper methods

  // Used to refetch task lists
  fetchTaskLists$(): Observable<ITaskListsResponse> {
    return this.homeStateStoreService.selectSearch$().pipe(
      take(1),
      switchMap((search) => this.taskListService.getTaskLists$(search)),
      tap((taskLists) => {
        this.homeStateStoreService.setTaskLists({
          data: taskLists,
          isLoading: false,
        });
      }),
    );
  }

  getTaskLists(): void {
    this.getTaskLists$.next();
  }
}
