import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITaskResponse } from 'src/app/features/task-list/shared/data/interfaces/task.interface';
import { TaskItemComponent } from '../task-item/task-item.component';
import { trackBy } from 'src/app/shared/data/functions/track-by.function';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TaskEffectsService } from '../../state/task/task.effects.service';
import { TaskStateService } from '../../state/task/task.state.service';
import { TaskListModalStateService } from '../../state/task-list-modal/task-list-modal.state.service';
import { filter, skip, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, NzButtonModule, TaskItemComponent],
  providers: [TaskStateService, TaskEffectsService],
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.less'],
})
export class TasksListComponent implements OnInit {
  trackByFn = trackBy;

  @Input({ required: true }) tasks: ITaskResponse[];

  private taskListModalStateService = inject(TaskListModalStateService);

  selectedTaskId: string | null = null;

  isStoringTask = false;

  private taskListState$ =
    this.taskListModalStateService.selectTaskListState$();

  // Reset 'selectedTaskId' and 'isStoringTask' every time 'taskList' is updated
  private updatedTaskListListener$ = this.taskListState$.pipe(
    skip(1),
    filter((taskListState) => !taskListState.isLoading),
    tap(() => {
      this.selectedTaskId = null;
      this.isStoringTask = false;
    }),
    takeUntilDestroyed(),
  );

  ngOnInit(): void {
    this.updatedTaskListListener$.subscribe();
  }
}
