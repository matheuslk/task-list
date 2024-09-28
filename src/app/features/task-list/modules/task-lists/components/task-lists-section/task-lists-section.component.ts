import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  ITaskListResponse,
  ITaskListWithTasksResponse,
} from 'src/app/features/task-list/data/interfaces/task-list.interface';
import { TaskListCardComponent } from '../../../cards/task-list-card/task-list-card.component';

@Component({
  selector: 'app-task-lists-section',
  standalone: true,
  imports: [CommonModule, NzGridModule, NzIconModule, TaskListCardComponent],
  templateUrl: './task-lists-section.component.html',
  styleUrls: ['./task-lists-section.component.less'],
})
export class TaskListsSectionComponent {
  @Input({
    required: true,
  })
  taskLists: ITaskListWithTasksResponse[];
  @Input() title?: string;
  @Input() icon?: string;
  @Input() iconTheme: 'fill' | 'outline' = 'outline';
  @Input() showIcon = true;

  trackList(index: number, taskList: ITaskListResponse): string {
    return taskList.id;
  }
}
