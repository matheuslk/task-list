import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  combineLatest,
  delay,
  exhaustMap,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { GlobalStateStoreService } from 'src/app/core/state/global.state.store.service';
import {
  ITaskList,
  ITaskListResponse,
} from '../../data/interfaces/task-list.interface';
import { TaskListService } from '../../services/task-list.service';
import { HomeStateStoreService } from '../home/home.state.store.service';
import { TaskListStateStoreService } from './task-list.state.store.service';

@Injectable()
export class TaskListStateEffectsService {
  constructor() {
    this.updateTaskListListener$.pipe(takeUntilDestroyed()).subscribe();
    this.removeTaskListListener$.pipe(takeUntilDestroyed()).subscribe();
    this.globalLoadingListener$.pipe(takeUntilDestroyed()).subscribe();
  }

  private globalStateStoreService = inject(GlobalStateStoreService);
  private homeStateStoreService = inject(HomeStateStoreService);
  private taskListStateStoreService = inject(TaskListStateStoreService);
  private taskListService = inject(TaskListService);

  private updateTaskList$: Subject<{
    taskList: ITaskList;
    fetchTasks?: boolean;
  }> = new Subject();
  private updateTaskListListener$ = this.updateTaskList$.pipe(
    exhaustMap((updatedTaskListData) => {
      this.taskListStateStoreService.setUpdateTaskList({
        isLoading: true,
      });
      return this.taskListService
        .updateTaskList$(updatedTaskListData.taskList)
        .pipe(
          delay(2000),
          switchMap((updatedTaskList) => {
            const action$: Observable<any> = updatedTaskListData.fetchTasks
              ? this.fetchTaskLists$()
              : of(null);
            return action$.pipe(map(() => updatedTaskList));
          }),
          tap((updatedTaskList) => {
            this.taskListStateStoreService.setTaskList(updatedTaskList);
            this.taskListStateStoreService.setUpdateTaskList({
              data: updatedTaskList,
              isLoading: false,
            });
            console.log('L:64');
          }),
          catchError((error) => {
            this.taskListStateStoreService.setUpdateTaskList({
              error,
              isLoading: false,
            });
            return EMPTY;
          }),
        );
    }),
  );

  private removeTaskList$: Subject<void> = new Subject();
  private removeTaskListListener$ = this.removeTaskList$.pipe(
    exhaustMap(() => {
      this.taskListStateStoreService.setRemoveTaskList({
        isLoading: true,
      });
      return this.taskListStateStoreService.selectTaskList$().pipe(
        delay(2000),
        take(1),
        switchMap((taskList) =>
          this.taskListService.removeTaskList$(taskList?.id as string),
        ),
        switchMap(() => this.fetchTaskLists$()),
        tap(() => {
          this.taskListStateStoreService.setRemoveTaskList({
            isLoading: false,
          });
        }),
        catchError((error) => {
          this.taskListStateStoreService.setUpdateTaskList({
            error,
            isLoading: false,
          });
          return EMPTY;
        }),
      );
    }),
  );

  private globalLoadingListener$ = combineLatest([
    this.taskListStateStoreService.selectUpdateTaskList$(),
    this.taskListStateStoreService.selectRemoveTaskList$(),
  ]).pipe(
    tap(([updateTaskList, removeTaskList]) => {
      if (updateTaskList.isLoading || removeTaskList.isLoading) {
        this.globalStateStoreService.setIsLoading(true);
        return;
      }
      this.globalStateStoreService.setIsLoading(false);
    }),
  );

  // Helper methods

  private fetchTaskLists$(): Observable<ITaskListResponse> {
    return this.homeStateStoreService.selectSearch$().pipe(
      take(1),
      switchMap((search) =>
        this.taskListService.getTaskLists$({ title: search }),
      ),
      tap((taskLists) => {
        this.homeStateStoreService.setTaskLists({
          data: taskLists,
          isLoading: false,
        });
      }),
    );
  }

  updateTaskList(taskList: ITaskList, fetchTasks?: boolean): void {
    this.updateTaskList$.next({ taskList, fetchTasks });
  }

  removeTaskList(): void {
    this.removeTaskList$.next();
  }
}
