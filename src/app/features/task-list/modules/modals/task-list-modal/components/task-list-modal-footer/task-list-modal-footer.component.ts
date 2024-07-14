import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TaskListModalStateEffectsService } from '../../state/task-list-modal.state.effects.service';

const modules = [NzIconModule, NzButtonModule];

@Component({
  selector: 'app-task-list-modal-footer',
  standalone: true,
  imports: [CommonModule, ...modules],
  templateUrl: './task-list-modal-footer.component.html',
  styleUrls: ['./task-list-modal-footer.component.less'],
})
export class TaskListModalFooterComponent {
  private taskListModalStateEffectsService = inject(
    TaskListModalStateEffectsService,
  );

  handleClose(): void {
    this.taskListModalStateEffectsService.close();
  }
}
