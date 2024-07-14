import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit, inject } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ITaskListWithTasksResponse } from '../../../data/interfaces/task-list.interface';
import { GetBgColorClassPipe } from '../../../pipes/get-bg-color-class.pipe';
import { TaskListStateEffectsService } from '../../../state/task-list/task-list.state.effects.service';
import { TaskListStateStoreService } from '../../../state/task-list/task-list.state.store.service';
import { TaskListCardFooterComponent } from './components/task-list-card-footer/task-list-card-footer.component';
import { TaskListCardHeaderComponent } from './components/task-list-card-header/task-list-card-header.component';
import { TaskListCardStateStoreService } from './state/task-list-card.state.store.service';

const modules = [NzCardModule, NzTagModule];
const components = [TaskListCardHeaderComponent, TaskListCardFooterComponent];
const pipes = [GetBgColorClassPipe];

@Component({
  selector: 'app-task-list-card',
  standalone: true,
  imports: [CommonModule, ...modules, ...components, ...pipes],
  providers: [
    TaskListCardStateStoreService,
    TaskListStateStoreService,
    TaskListStateEffectsService,
  ],
  templateUrl: './task-list-card.component.html',
  styleUrls: ['./task-list-card.component.less'],
})
export class TaskListCardComponent implements OnInit {
  private taskListCardStateStoreService = inject(TaskListCardStateStoreService);
  private taskListStateStoreService = inject(TaskListStateStoreService);

  @HostListener('mouseenter')
  public mouseenterListener(): void {
    this.taskListCardStateStoreService.setIsHovered(true);
  }

  @HostListener('mouseleave')
  public mouseleaveListener(): void {
    this.taskListCardStateStoreService.setIsHovered(false);
  }

  @Input({ required: true }) taskList: ITaskListWithTasksResponse;

  taskList$ = this.taskListStateStoreService.selectTaskList$();
  showOptions$ = this.taskListCardStateStoreService.selectShowOptions$();

  ngOnInit(): void {
    this.taskListStateStoreService.setTaskList(this.taskList);
  }
}
