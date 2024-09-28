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
import { GlobalStateStoreService } from 'src/app/core/state/global.state.store.service';
import { ITaskListWithTasksResponse } from 'src/app/features/task-list/data/interfaces/task-list.interface';
import { HomeStateEffectsService } from 'src/app/features/task-list/state/home/home.state.effects.service';
import { getModalClass } from '../../data/functions/get-modal-class.function';
import { ITaskListModalData } from '../../data/interfaces/task-list-modal-data.interface';
import { TaskListModalComponent } from '../../task-list-modal.component';

@Injectable({
  providedIn: 'root',
})
export class TaskListModalControllerStateEffectsService {
  private modalService = inject(NzModalService);
  private globalStateStoreService = inject(GlobalStateStoreService);
  private homeStateEffectsService = inject(HomeStateEffectsService);

  private refetchOnClose$ = new BehaviorSubject(false);

  close$ = new EventEmitter<void>();
  private closeListener$ = this.close$.asObservable().pipe(
    switchMap(() => this.refetchOnClose$.asObservable().pipe(take(1))),
    filter((shouldRefetch) => !!shouldRefetch),
    exhaustMap(() => {
      this.globalStateStoreService.setIsLoading(true);
      return this.homeStateEffectsService.fetchTaskLists$().pipe(
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
    this.globalStateStoreService.setIsLoading(false);
    this.refetchOnClose$.next(false);
  }
}
