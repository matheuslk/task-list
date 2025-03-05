import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITaskResponse } from 'src/app/features/task-list/shared/data/interfaces/task.interface';
import { TaskItemComponent } from '../task-item/task-item.component';
import { trackBy } from 'src/app/shared/data/functions/track-by.function';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TaskEffectsService } from '../../state/task/task.effects.service';
import { TaskStateService } from '../../state/task/task.state.service';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, NzButtonModule, TaskItemComponent],
  providers: [TaskStateService, TaskEffectsService],
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.less'],
})
export class TasksListComponent {
  trackByFn = trackBy;

  @Input({ required: true }) tasks: ITaskResponse[];

  selectedTaskId: string | null = null;

  isStoringTask = false;

  handleSelectTask(taskId: string): void {
    this.selectedTaskId = taskId;
  }

  handleUnselectTask(taskId: string): void {
    // O selecionamento de um novo item ocorre antes do desselecionamento do anterior, sendo assim, se faz necessária
    // uma verificação a fim de garantir que o item desselecionado seja o mesmo que foi selecionado
    if (this.selectedTaskId !== taskId) {
      return;
    }
    this.selectedTaskId = null;
  }
}
