import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { distinctUntilChanged, map, skip, tap } from 'rxjs';
import { TaskListStateEffectsModel } from '../../../data/models/task-list.state.effects.model';
import { TaskListStateStoreService } from '../../../state/task-list/task-list.state.store.service';
import { TaskListModalFooterComponent } from './components/task-list-modal-footer/task-list-modal-footer.component';
import { TaskListModalHeaderComponent } from './components/task-list-modal-header/task-list-modal-header.component';
import { getModalClass } from './data/functions/get-modal-class.function';
import { TaskListModalStateEffectsService } from './state/task-list-modal/task-list-modal.state.effects.service';
import { TaskListModalStateStoreService } from './state/task-list-modal/task-list-modal.state.store.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    TaskListModalHeaderComponent,
    TaskListModalFooterComponent,
  ],
  providers: [
    TaskListModalStateStoreService,
    TaskListModalStateEffectsService,
    {
      provide: TaskListStateStoreService,
      useExisting: TaskListModalStateStoreService,
    },
    {
      provide: TaskListStateEffectsModel,
      useExisting: TaskListModalStateEffectsService,
    },
  ],
  templateUrl: './task-list-modal.component.html',
  styleUrls: [],
})
export class TaskListModalComponent implements OnInit {
  private readonly modalRef = inject(NzModalRef);
  private taskListModalStateStoreService = inject(
    TaskListModalStateStoreService,
  );

  private taskList$ = this.taskListModalStateStoreService.selectTaskListData$();

  private bgColorListener$ = this.taskList$.pipe(
    skip(1),
    map((taskList) => taskList.bgColor),
    distinctUntilChanged(),
    tap((bgColor) => {
      console.log('bgColorListener - ', bgColor);
      this.modalRef.updateConfig({
        nzClassName: getModalClass(bgColor),
      });
    }),
    takeUntilDestroyed(),
  );

  ngOnInit(): void {
    this.bgColorListener$.subscribe();
  }
}
