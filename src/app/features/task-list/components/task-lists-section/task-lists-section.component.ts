import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITaskList } from '../../data/interfaces/task-list.interface';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TaskListCardComponent } from '../task-list-card/task-list-card.component';

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
  taskLists: ITaskList[];
  @Input() title?: string;
  @Input() icon?: string;
  @Input() iconTheme: 'fill' | 'outline' = 'outline';
  @Input() showIcon = true;
}
