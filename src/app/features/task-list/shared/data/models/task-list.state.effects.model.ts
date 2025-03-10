import { Directive, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  exhaustMap,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { GlobalStateService } from 'src/app/core/state/global.state.service';
import {
  ITaskListResponse,
  ITaskListWithTasksResponse,
} from '../interfaces/task-list.interface';
import { TaskListService } from '../../services/task-list.service';
import { TaskListStateService } from '../../state/task-list/task-list.state.service';

@Directive()
export abstract class TaskListEffectsModel {
  protected taskListStateService = inject(TaskListStateService);
  protected taskListService = inject(TaskListService);
  protected globalStateService = inject(GlobalStateService);

  protected taskList$ = this.taskListStateService.selectTaskListData$();

  private updateTaskList$: Subject<Partial<ITaskListResponse>> = new Subject();
  private updateTaskListListener$ = this.updateTaskList$.pipe(
    exhaustMap((updatedTaskList) => {
      this.taskListStateService.setTaskList({
        isLoading: true,
      });
      return this.taskList$.pipe(
        take(1),
        switchMap((currentTaskList) => {
          const request = {
            ...currentTaskList,
            ...updatedTaskList,
          };
          return this.taskListService
            .updateTaskList$(request)
            .pipe(
              switchMap((updatedTaskList) =>
                this.updateTaskListOnSuccess$(updatedTaskList),
              ),
            );
        }),
        catchError((error) => this.updateTaskListOnError$(error)),
      );
    }),
    takeUntilDestroyed(),
  );

  protected updateTaskListOnSuccess$(
    updatedTaskList: ITaskListWithTasksResponse,
  ): Observable<any> {
    return of({}).pipe(
      tap(() => {
        this.taskListStateService.setTaskList({
          data: updatedTaskList,
          isLoading: false,
        });
      }),
    );
  }

  private updateTaskListOnError$(error: any): Observable<any> {
    return this.onError$(error);
  }

  private removeTaskList$: Subject<void> = new Subject();
  private removeTaskListListener$ = this.removeTaskList$.pipe(
    exhaustMap(() => {
      this.taskListStateService.setTaskList({
        isLoading: true,
      });
      return this.taskList$.pipe(
        take(1),
        switchMap((taskList) =>
          this.taskListService.removeTaskList$(taskList.id),
        ),
        switchMap(() => this.removeTaskListOnSuccess$()),
        catchError((error) => this.removeTaskListOnError$(error)),
      );
    }),
    takeUntilDestroyed(),
  );

  protected removeTaskListOnSuccess$(): Observable<any> {
    return of({}).pipe(
      tap(() => {
        this.taskListStateService.setTaskList({
          isLoading: false,
        });
      }),
    );
  }

  private removeTaskListOnError$(error: any): Observable<any> {
    return this.onError$(error);
  }

  private onError$(error: any): Observable<any> {
    return of({}).pipe(
      tap(() => {
        this.taskListStateService.setTaskList({
          isLoading: false,
          error: error,
        });
      }),
    );
  }

  protected loadingListener$ = this.taskListStateService
    .selectTaskListState$()
    .pipe(
      tap((taskList) => {
        this.globalStateService.setIsLoading(taskList.isLoading);
      }),
      takeUntilDestroyed(),
    );

  protected setListeners(): void {
    this.loadingListener$.subscribe();
    this.updateTaskListListener$.subscribe();
    this.removeTaskListListener$.subscribe();
  }

  updateTaskList(taskList: Partial<ITaskListResponse>): void {
    this.updateTaskList$.next(taskList);
  }

  removeTaskList(): void {
    this.removeTaskList$.next();
  }
}
