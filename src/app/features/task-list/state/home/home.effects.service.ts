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
import { HomeStateService } from './home.state.service';

@Injectable({
  providedIn: 'root',
})
export class HomeEffectsService {
  constructor() {
    this.taskListsListener$.subscribe();
  }

  private homeStateService = inject(HomeStateService);
  private taskListService = inject(TaskListService);

  private getTaskLists$: Subject<void> = new Subject();
  private taskListsListener$ = this.getTaskLists$.pipe(
    switchMap(() =>
      this.homeStateService.selectTaskLists$().pipe(
        take(1),
        tap((taskListsState) => {
          this.homeStateService.setTaskLists({
            data: taskListsState.data,
            isLoading: true,
          });
        }),
        switchMap(() => this.fetchTaskLists$()),
        catchError((error) => {
          this.homeStateService.setTaskLists({
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
    return this.homeStateService.selectSearch$().pipe(
      take(1),
      switchMap((search) => this.taskListService.getTaskLists$(search)),
      tap((taskLists) => {
        this.homeStateService.setTaskLists({
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
