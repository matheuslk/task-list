import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Subject, tap } from 'rxjs';
import { TaskListStateEffectsService } from 'src/app/features/task-list/state/task-list/task-list.state.effects.service';
import { TaskListStateStoreService } from 'src/app/features/task-list/state/task-list/task-list.state.store.service';
import { TaskListCardStateStoreService } from '../../state/task-list-card.state.store.service';

@Component({
  selector: 'app-task-list-card-footer',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './task-list-card-footer.component.html',
  styleUrls: ['./task-list-card-footer.component.less'],
})
export class TaskListCardFooterComponent implements OnInit {
  private taskListStateStoreService = inject(TaskListStateStoreService);
  private taskListStateEffectsService = inject(TaskListStateEffectsService);
  private taskListCardStateStoreService = inject(TaskListCardStateStoreService);

  @Input() isFixed = false;

  taskList$ = this.taskListStateStoreService.selectTaskList$();
  showOptions$ = this.taskListCardStateStoreService.selectShowOptions$();

  removeTaskList$ = new Subject<void>();
  private removeTaskListListener$ = this.removeTaskList$.pipe(
    tap(() => {
      this.taskListStateEffectsService.removeTaskList();
    }),
    takeUntilDestroyed(),
  );

  ngOnInit(): void {
    this.removeTaskListListener$.subscribe();
  }
}
