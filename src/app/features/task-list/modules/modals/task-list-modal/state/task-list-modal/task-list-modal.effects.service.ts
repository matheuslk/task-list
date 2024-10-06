import { inject, Injectable } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Observable, of, switchMap, tap } from 'rxjs';
import { ITaskListWithTasksResponse } from 'src/app/features/task-list/data/interfaces/task-list.interface';
import { TaskListEffectsModel } from 'src/app/features/task-list/data/models/task-list.state.effects.model';
import { ITaskListModalData } from '../../data/interfaces/task-list-modal-data.interface';
import { TaskListModalControllerEffectsService } from '../task-list-modal-controller/task-list-modal-controller.state.effects.service';

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

  protected override updateTaskListOnSuccess$(
    updatedTaskList: ITaskListWithTasksResponse,
  ): Observable<any> {
    return of({}).pipe(
      switchMap(() => super.updateTaskListOnSuccess$(updatedTaskList)),
      tap(() => {
        this.taskListModalControllerEffectsService.refetchOnClose();
      }),
    );
  }

  protected override removeTaskListOnSuccess$(): Observable<any> {
    return of({}).pipe(
      switchMap(() => super.removeTaskListOnSuccess$()),
      tap(() => {
        this.taskListModalControllerEffectsService.refetchOnClose();
      }),
      tap(() => this.modalRef.close()),
    );
  }
}
