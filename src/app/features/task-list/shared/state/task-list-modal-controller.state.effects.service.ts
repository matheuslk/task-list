import { EventEmitter, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  exhaustMap,
  filter,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { GlobalStateService } from 'src/app/core/state/global.state.service';
import { ITaskListWithTasksResponse } from 'src/app/features/task-list/shared/data/interfaces/task-list.interface';
import { HomeEffectsService } from 'src/app/features/task-list/shared/state/home/home.effects.service';
import { getModalClass } from '../../components/task-list-modal/data/functions/get-modal-class.function';
import { ITaskListModalData } from '../../components/task-list-modal/data/interfaces/task-list-modal-data.interface';
import { TaskListModalComponent } from '../../components/task-list-modal/task-list-modal.component';

@Injectable({
  providedIn: 'root',
})
export class TaskListModalControllerEffectsService {
  private modalService = inject(NzModalService);
  private globalStateService = inject(GlobalStateService);
  private homeEffectsService = inject(HomeEffectsService);

  private refetchOnClose$ = new BehaviorSubject(false);

  close$ = new EventEmitter<void>();
  private closeListener$ = this.close$.asObservable().pipe(
    switchMap(() => this.refetchOnClose$.asObservable().pipe(take(1))),
    filter((shouldRefetch) => !!shouldRefetch),
    exhaustMap(() => {
      this.globalStateService.setIsLoading(true);
      return this.homeEffectsService.fetchTaskLists$().pipe(
        tap(() => {
          this.onRefetch();
        }),
        catchError(() => {
          this.onRefetch();
          return EMPTY;
        }),
      );
    }),
    takeUntilDestroyed(),
  );

  constructor() {
    this.closeListener$.subscribe();
  }

  create(taskList: ITaskListWithTasksResponse): void {
    const modalData: ITaskListModalData = {
      taskList,
    };
    this.modalService.create({
      nzContent: TaskListModalComponent,
      nzData: modalData,
      nzMaskClosable: true,
      nzClosable: false,
      nzAfterClose: this.close$,
      nzClassName: getModalClass(taskList.bgColor),
    });
  }

  refetchOnClose(): void {
    this.refetchOnClose$.next(true);
  }

  private onRefetch(): void {
    this.globalStateService.setIsLoading(false);
    this.refetchOnClose$.next(false);
  }
}
