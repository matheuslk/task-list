import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { distinctUntilChanged, map, skip, tap } from 'rxjs';
import { TaskListEffectsModel } from '../../../data/models/task-list.state.effects.model';
import { TaskListStateService } from '../../../state/task-list/task-list.state.service';
import { TaskListModalFooterComponent } from './components/task-list-modal-footer/task-list-modal-footer.component';
import { TaskListModalHeaderComponent } from './components/task-list-modal-header/task-list-modal-header.component';
import { getModalClass } from './data/functions/get-modal-class.function';
import { TaskListModalEffectsService } from './state/task-list-modal/task-list-modal.effects.service';
import { TaskListModalStateService } from './state/task-list-modal/task-list-modal.state.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    TaskListModalHeaderComponent,
    TaskListModalFooterComponent,
  ],
  providers: [
    TaskListModalStateService,
    TaskListModalEffectsService,
    {
      provide: TaskListStateService,
      useExisting: TaskListModalStateService,
    },
    {
      provide: TaskListEffectsModel,
      useExisting: TaskListModalEffectsService,
    },
  ],
  templateUrl: './task-list-modal.component.html',
  styleUrls: [],
})
export class TaskListModalComponent implements OnInit {
  private readonly modalRef = inject(NzModalRef);
  private taskListModalStateService = inject(TaskListModalStateService);

  private taskList$ = this.taskListModalStateService.selectTaskListData$();

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
