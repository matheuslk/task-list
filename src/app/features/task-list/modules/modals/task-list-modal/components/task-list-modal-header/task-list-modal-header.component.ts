import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  skip,
  take,
  tap,
} from 'rxjs';
import { TaskListOptionsComponent } from '../../../../task-list-options/task-list-options.component';
import { TaskListModalStateEffectsService } from '../../state/task-list-modal/task-list-modal.state.effects.service';
import { TaskListModalStateStoreService } from '../../state/task-list-modal/task-list-modal.state.store.service';

@Component({
  selector: 'app-task-list-modal-header',
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputModule, TaskListOptionsComponent],
  templateUrl: './task-list-modal-header.component.html',
  styleUrls: ['./task-list-modal-header.component.less'],
})
export class TaskListModalHeaderComponent implements OnInit {
  @ViewChild('titleInput')
  private taskListStateStoreService = inject(TaskListModalStateStoreService);
  private taskListModalStateEffectsService = inject(
    TaskListModalStateEffectsService,
  );

  taskListState$ = this.taskListStateStoreService.selectTaskListState$();
  taskList$ = this.taskListStateStoreService.selectTaskListData$();

  private setTitleListener$ = this.taskList$.pipe(
    take(1),
    tap((taskList) => {
      this.title$.next(taskList.title);
    }),
    takeUntilDestroyed(),
  );

  title$ = new BehaviorSubject('');
  private titleChangeListener$ = this.title$.pipe(
    skip(2),
    debounceTime(300),
    distinctUntilChanged(),
    tap((title) => {
      this.taskListModalStateEffectsService.updateTaskList({
        title,
      });
    }),
    takeUntilDestroyed(),
  );

  ngOnInit(): void {
    this.titleChangeListener$.subscribe();
    this.setTitleListener$.subscribe();
  }
}
