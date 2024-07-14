import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  EMPTY,
  Subject,
  catchError,
  combineLatest,
  exhaustMap,
  filter,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { GlobalStateStoreService } from 'src/app/core/state/global.state.store.service';
import { TaskListService } from 'src/app/features/task-list/services/task-list.service';
import { HomeStateEffectsService } from 'src/app/features/task-list/state/home/home.state.effects.service';
import { TaskListStateStoreService } from 'src/app/features/task-list/state/task-list/task-list.state.store.service';
import { TaskListsActionsStateStoreService } from '../../../task-lists-actions/state/task-lists-actions/task-lists-actions.state.store.service';
import { TaskListModalStateStoreService } from './task-list-modal.state.store.service';

@Injectable()
export class TaskListModalStateEffectsService {
  constructor() {
    this.closeListener$.subscribe();
    this.globalLoadingListener$.subscribe();
  }

  private globalStateStoreService = inject(GlobalStateStoreService);
  private homeStateEffectsService = inject(HomeStateEffectsService);
  private taskListModalStateStoreService = inject(
    TaskListModalStateStoreService,
  );
  private taskListService = inject(TaskListService);
  private taskListStateStoreService = inject(TaskListStateStoreService);
  private taskListsActionsStateStoreService = inject(
    TaskListsActionsStateStoreService,
  );

  private taskList$ = this.taskListStateStoreService.selectTaskList$();

  private close$: Subject<void> = new Subject();
  private closeListener$ = this.close$.pipe(
    exhaustMap(() => {
      this.taskListModalStateStoreService.setClose({
        isLoading: true,
      });
      return this.taskList$.pipe(
        take(1),
        switchMap((taskList) => {
          if (!taskList) {
            this.taskListsActionsStateStoreService.setIsStoringTaskList(false);
            return of(null);
          }
          return of(taskList);
        }),
        filter((taskList) => !!taskList),
        switchMap((taskList) => {
          if (taskList && !taskList.title && !taskList.tasks.length) {
            return this.taskListService.removeTaskList$(taskList?.id);
          }
          return of(null);
        }),
        switchMap(() => this.homeStateEffectsService.fetchTaskLists$()),
        tap(() => {
          this.taskListsActionsStateStoreService.setIsStoringTaskList(false);
          this.taskListModalStateStoreService.setClose({
            isLoading: false,
          });
        }),
        catchError((error) => {
          this.taskListsActionsStateStoreService.setIsStoringTaskList(false);
          this.taskListModalStateStoreService.setClose({
            isLoading: false,
            error,
          });
          return EMPTY;
        }),
      );
    }),
    takeUntilDestroyed(),
  );

  private globalLoadingListener$ = combineLatest([
    this.taskListModalStateStoreService.selectClose$(),
  ]).pipe(
    tap(([closeState]) => {
      if (closeState.isLoading) {
        this.globalStateStoreService.setIsLoading(true);
        return;
      }
      this.globalStateStoreService.setIsLoading(false);
    }),
    takeUntilDestroyed(),
  );

  close(): void {
    this.close$.next();
  }
}
