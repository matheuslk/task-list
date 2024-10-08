import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RemoveTaskListComponent } from 'src/app/features/task-list/components/remove-task-list/remove-task-list.component';
import { TaskListCardStateStoreService } from '../../state/task-list-card.state.store.service';
import { PreventClickBubblingDirective } from 'src/app/features/task-list/directives/prevent-click-bubbling.directive';

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
  private taskListCardStateStoreService = inject(TaskListCardStateStoreService);

  @Input() isFixed = false;

  showOptions$ = this.taskListCardStateStoreService.selectShowOptions$();
}
