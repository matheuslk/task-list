import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ColorPopoverComponent } from 'src/app/features/task-list/components/color-popover/color-popover.component';
import { Color } from 'src/app/features/task-list/data/types/color.type';
import { TaskListStateStoreService } from 'src/app/features/task-list/state/task-list/task-list.state.store.service';

const modules = [NzBadgeModule, NzIconModule];
const components = [ColorPopoverComponent];

@Component({
  selector: 'app-task-list-card-options',
  standalone: true,
  imports: [CommonModule, ...modules, ...components],
  templateUrl: './task-list-card-options.component.html',
  styleUrls: ['./task-list-card-options.component.less'],
})
export class TaskListCardOptionsComponent {
  private taskListStateStoreService = inject(TaskListStateStoreService);

  @Output() visibilityChange = new EventEmitter<boolean>();
  @Output() colorSelect = new EventEmitter<Color | undefined>();
  @Output() pinTask = new EventEmitter<void>();

  @Input() showBadge = true;
  @Input() showOptions = true;

  taskList$ = this.taskListStateStoreService.selectTaskList$();
}
