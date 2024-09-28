import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  combineLatest,
  exhaustMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { GlobalStateStoreService } from 'src/app/core/state/global.state.store.service';
import {
  ITaskListRequest,
  ITaskListWithTasksResponse,
} from 'src/app/features/task-list/data/interfaces/task-list.interface';
import { TaskListService } from 'src/app/features/task-list/services/task-list.service';
import { TaskListModalControllerStateEffectsService } from '../../../modals/task-list-modal/state/task-list-modal-controller/task-list-modal-controller.state.effects.service';
import { TaskListsActionsStateStoreService } from '../task-lists-actions/task-lists-actions.state.store.service';
import { TaskListStoreStateStoreService } from './task-list-store.state.store.service';

@Injectable()
export class TaskListStoreStateEffectsService {
  private globalStateStoreService = inject(GlobalStateStoreService);
  private taskListStoreStateStoreService = inject(
    TaskListStoreStateStoreService,
  );
  private taskListsActionsStateStoreService = inject(
    TaskListsActionsStateStoreService,
  );
  private taskListService = inject(TaskListService);
  private taskListModalControllerStateEffectsService = inject(
    TaskListModalControllerStateEffectsService,
  );
  constructor() {
    this.storeTaskListListener$.subscribe();
    this.globalLoadingListener$.subscribe();
  }

  private storeTaskList$: Subject<ITaskListRequest> = new Subject();
  private storeTaskListListener$ = this.storeTaskList$.pipe(
    exhaustMap((taskListRequest) => {
      this.taskListStoreStateStoreService.setStoreTaskList({
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
        this.taskListStoreStateStoreService.setStoreTaskList({
          data: storedTaskList,
          isLoading: false,
        });
        this.taskListsActionsStateStoreService.setIsStoringTaskList(false);
        this.taskListModalControllerStateEffectsService.create(storedTaskList);
      }),
    );
  }
  private storeTaskListOnError$(error: any): Observable<never> {
    this.taskListStoreStateStoreService.setStoreTaskList({
      error,
      isLoading: false,
    });
    return EMPTY;
  }

  private globalLoadingListener$ = combineLatest([
    this.taskListStoreStateStoreService.selectStoreTaskList$(),
  ]).pipe(
    tap(([storeTaskList]) => {
      if (storeTaskList.isLoading) {
        this.globalStateStoreService.setIsLoading(true);
        return;
      }
      this.globalStateStoreService.setIsLoading(false);
    }),
    takeUntilDestroyed(),
  );

  storeTaskList(taskList: ITaskListRequest): void {
    this.storeTaskList$.next(taskList);
  }
}
