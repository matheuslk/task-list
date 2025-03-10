import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  defer,
  EMPTY,
  exhaustMap,
  filter,
  merge,
  Observable,
  of,
  skip,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { GlobalStateService } from 'src/app/core/state/global.state.service';
import {
  ITaskRequest,
  ITaskResponse,
} from 'src/app/features/task-list/shared/data/interfaces/task.interface';
import { TaskService } from 'src/app/features/task-list/components/task-list-modal/services/task.service';
import { TaskListModalEffectsService } from '../task-list-modal/task-list-modal.effects.service';
import { TaskStateService } from './task.state.service';
import { TaskListModalStateService } from '../task-list-modal/task-list-modal.state.service';
import { IStateData } from 'src/app/core/data/interfaces/state-data.interface';
import { ITaskListWithTasksResponse } from 'src/app/features/task-list/shared/data/interfaces/task-list.interface';

@Injectable()
export class TaskEffectsService {
  private taskStateService = inject(TaskStateService);
  private taskService = inject(TaskService);
  private taskListModalStateService = inject(TaskListModalStateService);
  private taskListModalEffectsService = inject(TaskListModalEffectsService);
  private globalStateService = inject(GlobalStateService);

  constructor() {
    this.setListeners();
  }

  private storeTask$: Subject<ITaskRequest> = new Subject();
  private storeTaskListener$ = this.storeTask$.pipe(
    exhaustMap((storeTask) => {
      this.taskStateService.setTask({
        isLoading: true,
      });
      return this.taskService.storeTask$(storeTask).pipe(
        switchMap((storedTask) => this.onSuccess$(storedTask)),
        catchError((error) => this.onError$(error)),
      );
    }),
    takeUntilDestroyed(),
  );

  private updateTask$: Subject<ITaskResponse> = new Subject();
  private updateTaskListener$ = this.updateTask$.pipe(
    exhaustMap((updateTask) => {
      this.taskStateService.setTask({
        isLoading: true,
      });
      return this.taskService.updateTask$(updateTask).pipe(
        switchMap((updatedTask) => this.onSuccess$(updatedTask)),
        catchError((error) => this.onError$(error)),
      );
    }),
    takeUntilDestroyed(),
  );

  private removeTask$: Subject<string> = new Subject();
  private removeTaskListener$ = this.removeTask$.pipe(
    exhaustMap((taskId) => {
      this.taskStateService.setTask({
        isLoading: true,
      });
      return this.taskService.removeTask$(taskId).pipe(
        switchMap((removedTask) => this.onSuccess$(removedTask)),
        catchError((error) => this.onError$(error)),
      );
    }),
    takeUntilDestroyed(),
  );

  private onSuccess$(
    task: ITaskResponse,
  ): Observable<IStateData<ITaskListWithTasksResponse>> {
    return this.refetchTaskList$().pipe(
      tap(() => {
        this.taskStateService.setTask({
          data: task,
          isLoading: false,
        });
      }),
    );
  }

  private onError$(error: any): Observable<any> {
    this.taskStateService.setTask({
      isLoading: false,
      error: error,
    });
    return EMPTY;
  }

  private refetchTaskList$(): Observable<
    IStateData<ITaskListWithTasksResponse>
  > {
    const taskList$ = this.taskListModalStateService.selectTaskListState$();

    return merge(
      taskList$.pipe(skip(2)),
      defer(() => of(this.taskListModalEffectsService.refetchTaskList())),
    ).pipe(
      filter(
        (taskList): taskList is IStateData<ITaskListWithTasksResponse> =>
          !!taskList,
      ),
      take(1),
    );
  }

  private loadingListener$ = this.taskStateService.selectTaskState$().pipe(
    tap((taskState) => {
      this.globalStateService.setIsLoading(taskState.isLoading);
    }),
    takeUntilDestroyed(),
  );

  private setListeners(): void {
    this.loadingListener$.subscribe();
    this.storeTaskListener$.subscribe();
    this.updateTaskListener$.subscribe();
    this.removeTaskListener$.subscribe();
  }

  storeTask(task: ITaskRequest): void {
    this.storeTask$.next(task);
  }

  updateTask(task: ITaskResponse): void {
    this.updateTask$.next(task);
  }

  removeTask(taskId: string): void {
    this.removeTask$.next(taskId);
  }
}
