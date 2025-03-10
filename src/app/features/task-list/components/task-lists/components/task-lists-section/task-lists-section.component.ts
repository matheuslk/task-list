import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ITaskListWithTasksResponse } from 'src/app/features/task-list/shared/data/interfaces/task-list.interface';
import { trackBy } from 'src/app/shared/data/functions/track-by.function';
import { TaskListCardComponent } from '../../../task-list-card/task-list-card.component';

@Component({
  selector: 'app-task-lists-section',
  standalone: true,
  imports: [CommonModule, NzGridModule, NzIconModule, TaskListCardComponent],
  templateUrl: './task-lists-section.component.html',
  styleUrls: ['./task-lists-section.component.less'],
})
export class TaskListsSectionComponent {
  trackByFn = trackBy;

  @Input({
    required: true,
  })
  taskLists: ITaskListWithTasksResponse[];
  @Input() title?: string;
  @Input() icon?: string;
  @Input() iconTheme: 'fill' | 'outline' = 'outline';
  @Input() showIcon = true;
}
