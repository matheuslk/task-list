import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  combineLatest,
  exhaustMap,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { GlobalStateStoreService } from 'src/app/core/state/global.state.store.service';
import {
  ITaskListRequest,
  ITaskListWithTasksResponse,
  ITaskListsResponse,
} from '../../data/interfaces/task-list.interface';
import { TaskListService } from '../../services/task-list.service';
import { HomeStateEffectsService } from '../home/home.state.effects.service';
import { TaskListStateStoreService } from './task-list.state.store.service';

@Injectable()
export class TaskListStateEffectsService {
  constructor() {
    this.updateTaskListListener$.subscribe();
    this.removeTaskListListener$.subscribe();
    this.globalLoadingListener$.subscribe();
  }

  private globalStateStoreService = inject(GlobalStateStoreService);
  private homeStateEffectsService = inject(HomeStateEffectsService);
  private taskListStateStoreService = inject(TaskListStateStoreService);
  private taskListService = inject(TaskListService);

  private taskList$ = this.taskListStateStoreService.selectTaskList$();

  private updateTaskList$: Subject<{
    taskList: ITaskListRequest;
    fetchTasks?: boolean;
  }> = new Subject();
  private updateTaskListListener$ = this.updateTaskList$.pipe(
    exhaustMap(({ taskList: taskListRequest, fetchTasks }) => {
      this.taskListStateStoreService.setUpdateTaskList({
        isLoading: true,
      });
      return this.taskList$.pipe(
        take(1),
        switchMap((currentTaskList) => {
          const request = {
            ...(currentTaskList as ITaskListWithTasksResponse),
            ...taskListRequest,
          };
          return this.taskListService.updateTaskList$(request).pipe(
            switchMap((updatedTaskList) => {
              const refetch$: Observable<ITaskListsResponse | null> = fetchTasks
                ? this.homeStateEffectsService.fetchTaskLists$()
                : of(null);
              return refetch$.pipe(map(() => updatedTaskList));
            }),
            tap((updatedTaskList) => {
              this.updateTaskListOnSuccess(updatedTaskList);
            }),
          );
        }),
        catchError((error) => this.updateTaskListOnError$(error)),
      );
    }),
    takeUntilDestroyed(),
  );
  private updateTaskListOnSuccess(
    updatedTaskList: ITaskListWithTasksResponse,
  ): void {
    this.taskListStateStoreService.setTaskList(updatedTaskList);
    this.taskListStateStoreService.setUpdateTaskList({
      data: updatedTaskList,
      isLoading: false,
    });
  }
  private updateTaskListOnError$(error: any): Observable<never> {
    this.taskListStateStoreService.setUpdateTaskList({
      error,
      isLoading: false,
    });
    return EMPTY;
  }

  private removeTaskList$: Subject<void> = new Subject();
  private removeTaskListListener$ = this.removeTaskList$.pipe(
    exhaustMap(() => {
      this.taskListStateStoreService.setRemoveTaskList({
        isLoading: true,
      });
      return this.taskListStateStoreService.selectTaskList$().pipe(
        take(1),
        switchMap((taskList) =>
          this.taskListService.removeTaskList$(taskList?.id as string),
        ),
        switchMap(() => this.homeStateEffectsService.fetchTaskLists$()),
        tap(() => {
          this.taskListStateStoreService.setRemoveTaskList({
            isLoading: false,
          });
        }),
        catchError((error) => {
          this.taskListStateStoreService.setRemoveTaskList({
            error,
            isLoading: false,
          });
          return EMPTY;
        }),
      );
    }),
    takeUntilDestroyed(),
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
    takeUntilDestroyed(),
  );

  updateTaskList(taskList: ITaskListRequest, fetchTasks?: boolean): void {
    this.updateTaskList$.next({ taskList, fetchTasks });
  }

  removeTaskList(): void {
    this.removeTaskList$.next();
  }
}
