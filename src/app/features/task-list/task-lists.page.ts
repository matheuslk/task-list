import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { TaskListCardComponent } from './components/task-list-card/task-list-card.component';
import { TaskListService } from './services/task-list.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzGridModule,
    NzButtonModule,
    TaskListCardComponent,
  ],
  templateUrl: './task-lists.page.html',
  styleUrls: ['./task-lists.page.less'],
})
export class TaskListsPage {
  taskListService = inject(TaskListService);
  localStorageService = inject(LocalStorageService);

  taskLists$ = this.taskListService.getTaskLists$();
}
