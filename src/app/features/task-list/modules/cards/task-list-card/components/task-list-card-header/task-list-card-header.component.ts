import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { TaskListStateService } from 'src/app/features/task-list/state/task-list/task-list.state.service';
import { TaskListOptionsComponent } from '../../../../task-list-options/task-list-options.component';
import { TaskListCardStateService } from '../../state/task-list-card.state.service';

const modules = [NzTypographyModule, NzBadgeModule];
const components = [TaskListOptionsComponent];

@Component({
  selector: 'app-task-list-card-header',
  standalone: true,
  imports: [CommonModule, ...modules, ...components],
  templateUrl: './task-list-card-header.component.html',
  styleUrls: ['./task-list-card-header.component.less'],
})
export class TaskListCardHeaderComponent {
  private taskListStateService = inject(TaskListStateService);
  private taskListCardStateService = inject(TaskListCardStateService);

  taskList$ = this.taskListStateService.selectTaskListData$();
  showOptions$ = this.taskListCardStateService.selectShowOptions$();
}
