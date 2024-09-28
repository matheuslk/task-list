import { inject, Injectable } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Observable, of, switchMap, tap } from 'rxjs';
import { ITaskListWithTasksResponse } from 'src/app/features/task-list/data/interfaces/task-list.interface';
import { TaskListStateEffectsModel } from 'src/app/features/task-list/data/models/task-list.state.effects.model';
import { ITaskListModalData } from '../../data/interfaces/task-list-modal-data.interface';
import { TaskListModalControllerStateEffectsService } from '../task-list-modal-controller/task-list-modal-controller.state.effects.service';

@Injectable()
export class TaskListModalStateEffectsService extends TaskListStateEffectsModel {
  private readonly nzModalData: ITaskListModalData = inject(NZ_MODAL_DATA);
  private taskListModalControllerStateEffectsService = inject(
    TaskListModalControllerStateEffectsService,
  );
  private modalRef = inject(NzModalRef);

  constructor() {
    super();
    this.setListeners();
    this.taskListStateStoreService.setTaskList({
      data: this.nzModalData.taskList,
      isLoading: false,
    });
  }

  protected override updateTaskListOnSuccess$(
    updatedTaskList: ITaskListWithTasksResponse,
  ): Observable<any> {
    return of({}).pipe(
      switchMap(() => super.updateTaskListOnSuccess$(updatedTaskList)),
      tap(() => {
        this.taskListModalControllerStateEffectsService.refetchOnClose();
      }),
    );
  }

  protected override removeTaskListOnSuccess$(): Observable<any> {
    return of({}).pipe(
      switchMap(() => super.removeTaskListOnSuccess$()),
      tap(() => {
        this.taskListModalControllerStateEffectsService.refetchOnClose();
      }),
      tap(() => this.modalRef.close()),
    );
  }
}
