import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { TaskListCardHeader } from '../../data/models/task-list-card-header.model';
import { TaskListCardStateStoreService } from '../../state/task-list-card.state.store.service';
import { TaskListCardOptionsComponent } from '../task-list-card-options/task-list-card-options.component';

const modules = [NzTypographyModule];
const components = [TaskListCardOptionsComponent];

@Component({
  selector: 'app-task-list-card-header',
  standalone: true,
  imports: [CommonModule, ...modules, ...components],
  templateUrl: './task-list-card-header.component.html',
  styleUrls: ['./task-list-card-header.component.less'],
})
export class TaskListCardHeaderComponent
  extends TaskListCardHeader
  implements OnInit
{
  private taskListCardStateStoreService = inject(TaskListCardStateStoreService);

  showOptions$ = this.taskListCardStateStoreService.selectShowOptions$();

  ngOnInit(): void {
    super.setListeners();
  }

  handleVisibilityChange(isVisible: boolean): void {
    this.taskListCardStateStoreService.setIsFixed(isVisible);
  }
}
