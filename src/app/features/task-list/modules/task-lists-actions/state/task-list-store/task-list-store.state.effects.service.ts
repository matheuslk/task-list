import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  combineLatest,
  exhaustMap,
  switchMap,
  tap,
} from 'rxjs';
import { GlobalStateStoreService } from 'src/app/core/state/global.state.store.service';
import {
  ITaskListRequest,
  ITaskListResponse,
  ITaskListsResponse,
} from 'src/app/features/task-list/data/interfaces/task-list.interface';
import { TaskListService } from 'src/app/features/task-list/services/task-list.service';
import { TaskListsActionsStateStoreService } from '../task-lists-actions/task-lists-actions.state.store.service';
import { TaskListStoreStateStoreService } from './task-list-store.state.store.service';
import { HomeStateEffectsService } from 'src/app/features/task-list/state/home/home.state.effects.service';

@Injectable({
  providedIn: 'root',
})
export class TaskListStoreStateEffectsService {
  constructor() {
    this.storeTaskListListener$.subscribe();
    this.globalLoadingListener$.subscribe();
  }

  private globalStateStoreService = inject(GlobalStateStoreService);
  private taskListStoreStateStoreService = inject(
    TaskListStoreStateStoreService,
  );
  private taskListsActionsStateStoreService = inject(
    TaskListsActionsStateStoreService,
  );
  private taskListService = inject(TaskListService);
  private homeStateEffectsService = inject(HomeStateEffectsService);

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
    storedTaskList: ITaskListResponse,
  ): Observable<ITaskListsResponse> {
    return this.homeStateEffectsService.fetchTaskLists$().pipe(
      tap(() => {
        this.taskListStoreStateStoreService.setStoreTaskList({
          data: storedTaskList,
          isLoading: false,
        });
        console.log('storeTaskListOnSuccess - exibir modal');
        this.taskListsActionsStateStoreService.setIsStoringTaskList(false);
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
