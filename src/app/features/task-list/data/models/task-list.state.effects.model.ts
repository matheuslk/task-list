import { Directive, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  EMPTY,
  exhaustMap,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { GlobalStateStoreService } from 'src/app/core/state/global.state.store.service';
import {
  ITaskListRequest,
  ITaskListWithTasksResponse,
} from '../../data/interfaces/task-list.interface';
import { TaskListService } from '../../services/task-list.service';
import { TaskListStateStoreService } from '../../state/task-list/task-list.state.store.service';

@Directive()
export abstract class TaskListStateEffectsModel {
  protected taskListStateStoreService = inject(TaskListStateStoreService);
  protected taskListService = inject(TaskListService);
  protected globalStateStoreService = inject(GlobalStateStoreService);

  protected taskList$ = this.taskListStateStoreService.selectTaskListData$();

  private updateTaskList$: Subject<ITaskListRequest> = new Subject();
  private updateTaskListListener$ = this.updateTaskList$.pipe(
    exhaustMap((taskListRequest) => {
      this.taskListStateStoreService.setTaskList({
        isLoading: true,
      });
      return this.taskList$.pipe(
        take(1),
        switchMap((currentTaskList) => {
          const request = {
            ...currentTaskList,
            ...taskListRequest,
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
        this.taskListStateStoreService.setTaskList({
          data: updatedTaskList,
          isLoading: false,
        });
      }),
    );
  }
  private updateTaskListOnError$(error: any): Observable<never> {
    this.taskListStateStoreService.setTaskList({
      error,
      isLoading: false,
    });
    return EMPTY;
  }

  private removeTaskList$: Subject<void> = new Subject();
  private removeTaskListListener$ = this.removeTaskList$.pipe(
    exhaustMap(() => {
      this.taskListStateStoreService.setTaskList({
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
        this.taskListStateStoreService.setTaskList({
          isLoading: false,
        });
      }),
    );
  }

  private removeTaskListOnError$(error: any): Observable<never> {
    this.taskListStateStoreService.setTaskList({
      error,
      isLoading: false,
    });
    return EMPTY;
  }

  protected loadingListener$ = this.taskListStateStoreService
    .selectTaskListState$()
    .pipe(
      tap((taskList) => {
        this.globalStateStoreService.setIsLoading(taskList.isLoading);
      }),
      takeUntilDestroyed(),
    );

  protected setListeners(): void {
    this.loadingListener$.subscribe();
    this.updateTaskListListener$.subscribe();
    this.removeTaskListListener$.subscribe();
  }

  updateTaskList(taskList: ITaskListRequest): void {
    this.updateTaskList$.next(taskList);
  }

  removeTaskList(): void {
    this.removeTaskList$.next();
  }
}
