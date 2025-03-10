import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RemoveTaskListComponent } from 'src/app/features/task-list/shared/components/remove-task-list/remove-task-list.component';
import { TaskListCardStateService } from '../../state/task-list-card.state.service';
import { PreventClickBubblingDirective } from 'src/app/features/task-list/shared/directives/prevent-click-bubbling.directive';

const components = [RemoveTaskListComponent];

const directives = [PreventClickBubblingDirective];

@Component({
  selector: 'app-task-list-card-footer',
  standalone: true,
  imports: [CommonModule, ...components, ...directives],
  templateUrl: './task-list-card-footer.component.html',
  styleUrls: ['./task-list-card-footer.component.less'],
})
export class TaskListCardFooterComponent {
  private taskListCardStateService = inject(TaskListCardStateService);

  @Input() isFixed = false;

  showOptions$ = this.taskListCardStateService.selectShowOptions$();
}
