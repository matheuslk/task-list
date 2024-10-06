import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TaskListCardStateService } from '../cards/task-list-card/state/task-list-card.state.service';
import { ColorPopoverComponent } from './components/color-popover/color-popover.component';
import { PinTaskListComponent } from './components/pin-task-list/pin-task-list.component';
import { PreventClickBubblingDirective } from '../../directives/prevent-click-bubbling.directive';

const components = [ColorPopoverComponent, PinTaskListComponent];

const directives = [PreventClickBubblingDirective];

@Component({
  selector: 'app-task-list-options',
  standalone: true,
  imports: [CommonModule, ...components, directives],
  templateUrl: './task-list-options.component.html',
  styleUrls: ['./task-list-options.component.less'],
})
export class TaskListOptionsComponent {
  private taskListCardStateService = inject(TaskListCardStateService, {
    optional: true,
  });

  handleVisibilityChange(isVisible: boolean): void {
    if (this.taskListCardStateService) {
      this.taskListCardStateService.setIsFixed(isVisible);
    }
  }
}
