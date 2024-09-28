import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TaskListStateEffectsModel } from '../../data/models/task-list.state.effects.model';

const modules = [NzIconModule];

@Component({
  selector: 'app-remove-task-list',
  standalone: true,
  imports: [CommonModule, ...modules],
  templateUrl: './remove-task-list.component.html',
  styleUrls: ['./remove-task-list.component.less'],
})
export class RemoveTaskListComponent {
  private taskListStateEffectsService = inject(TaskListStateEffectsModel);

  removeTaskList(): void {
    this.taskListStateEffectsService.removeTaskList();
  }
}
