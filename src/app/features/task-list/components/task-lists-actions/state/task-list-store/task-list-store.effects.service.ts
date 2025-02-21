import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  combineLatest,
  EMPTY,
  exhaustMap,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { GlobalStateService } from 'src/app/core/state/global.state.service';
import {
  ITaskListRequest,
  ITaskListWithTasksResponse,
} from 'src/app/features/task-list/shared/data/interfaces/task-list.interface';
import { TaskListService } from 'src/app/features/task-list/shared/services/task-list.service';
import { TaskListModalControllerEffectsService } from '../../../../shared/state/task-list-modal-controller.state.effects.service';
import { TaskListsActionsStateService } from '../task-lists-actions/task-lists-actions.state.service';
import { TaskListStoreStateService } from './task-list-store.state.service';

@Injectable()
export class TaskListStoreEffectsService {
  private globalStateService = inject(GlobalStateService);
  private taskListStoreStateService = inject(TaskListStoreStateService);
  private taskListsActionsStateService = inject(TaskListsActionsStateService);
  private taskListService = inject(TaskListService);
  private taskListModalControllerEffectsService = inject(
    TaskListModalControllerEffectsService,
  );

  constructor() {
    this.storeTaskListListener$.subscribe();
    this.globalLoadingListener$.subscribe();
  }

  private storeTaskList$: Subject<ITaskListRequest> = new Subject();
  private storeTaskListListener$ = this.storeTaskList$.pipe(
    exhaustMap((taskListRequest) => {
      this.taskListStoreStateService.setStoreTaskList({
        isLoading: true,
      });
      return this.taskListService.storeTaskList$(taskListRequest).pipe(
        switchMap((storedTaskList) =>
          this.storeTaskListOnSuccess$(storedTaskList),
        ),
        catchError((error) => this.storeTaskListOnError$(error)),
      );
    }),
    takeUntilDestroyed(),
  );

  private storeTaskListOnSuccess$(
    storedTaskList: ITaskListWithTasksResponse,
  ): Observable<any> {
    return of({}).pipe(
      tap(() => {
        this.taskListStoreStateService.setStoreTaskList({
          data: storedTaskList,
          isLoading: false,
        });
        this.taskListsActionsStateService.setIsStoringTaskList(false);
        this.taskListModalControllerEffectsService.create(storedTaskList);
      }),
    );
  }

  private storeTaskListOnError$(error: any): Observable<never> {
    this.taskListStoreStateService.setStoreTaskList({
      error,
      isLoading: false,
    });
    return EMPTY;
  }

  private globalLoadingListener$ = combineLatest([
    this.taskListStoreStateService.selectStoreTaskList$(),
  ]).pipe(
    tap(([storeTaskList]) => {
      if (storeTaskList.isLoading) {
        this.globalStateService.setIsLoading(true);
        return;
      }
      this.globalStateService.setIsLoading(false);
    }),
    takeUntilDestroyed(),
  );

  storeTaskList(taskList: ITaskListRequest): void {
    this.storeTaskList$.next(taskList);
  }
}
