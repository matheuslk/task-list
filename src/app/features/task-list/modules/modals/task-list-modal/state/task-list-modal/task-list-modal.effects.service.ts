import { inject, Injectable } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import {
  catchError,
  EMPTY,
  exhaustMap,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { ITaskListWithTasksResponse } from 'src/app/features/task-list/data/interfaces/task-list.interface';
import { TaskListEffectsModel } from 'src/app/features/task-list/data/models/task-list.state.effects.model';
import { ITaskListModalData } from '../../data/interfaces/task-list-modal-data.interface';
import { TaskListModalControllerEffectsService } from '../task-list-modal-controller/task-list-modal-controller.state.effects.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class TaskListModalEffectsService extends TaskListEffectsModel {
  private readonly nzModalData: ITaskListModalData = inject(NZ_MODAL_DATA);
  private taskListModalControllerEffectsService = inject(
    TaskListModalControllerEffectsService,
  );
  private modalRef = inject(NzModalRef);

  constructor() {
    super();
    this.setListeners();
    this.taskListStateService.setTaskList({
      data: this.nzModalData.taskList,
      isLoading: false,
    });
  }

  private refetchTaskList$: Subject<void> = new Subject();
  private refetchTaskListListener$ = this.refetchTaskList$.pipe(
    exhaustMap(() => {
      this.taskListStateService.setTaskList({
        isLoading: true,
      });
      const taskListId = this.nzModalData.taskList.id;
      return this.taskListService.getTaskList$(taskListId).pipe(
        switchMap((taskList) => this.refetchTaskListOnSuccess$(taskList)),
        catchError((error) => this.refetchTaskListOnError$(error)),
      );
    }),
    takeUntilDestroyed(),
  );

  private refetchTaskListOnSuccess$(
    taskList: ITaskListWithTasksResponse,
  ): Observable<any> {
    this.taskListStateService.setTaskList({
      data: taskList,
      isLoading: false,
    });
    this.taskListModalControllerEffectsService.refetchOnClose();
    return EMPTY;
  }

  private refetchTaskListOnError$(error: any): Observable<any> {
    this.taskListStateService.setTaskList({
      isLoading: false,
      error,
    });
    return EMPTY;
  }

  protected override updateTaskListOnSuccess$(
    updatedTaskList: ITaskListWithTasksResponse,
  ): Observable<any> {
    return super.updateTaskListOnSuccess$(updatedTaskList).pipe(
      tap(() => {
        this.taskListModalControllerEffectsService.refetchOnClose();
      }),
    );
  }

  protected override removeTaskListOnSuccess$(): Observable<any> {
    return super.removeTaskListOnSuccess$().pipe(
      tap(() => {
        this.taskListModalControllerEffectsService.refetchOnClose();
      }),
      tap(() => this.modalRef.close()),
    );
  }

  protected override setListeners(): void {
    super.setListeners();
    this.refetchTaskListListener$.subscribe();
  }

  refetchTaskList(): void {
    this.refetchTaskList$.next();
  }
}
