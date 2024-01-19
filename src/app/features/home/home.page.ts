import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ITaskList } from '../task/data/interfaces/task.interface';
import { TaskService } from '../task/data/services/task.service';
import { TaskListCardComponent } from './components/task-card/task-list-card.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzGridModule,
    NzButtonModule,
    TaskListCardComponent,
  ],
  providers: [TaskService],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.less'],
})
export class HomePage {
  taskLists: Signal<ITaskList[] | undefined> = toSignal(
    this.taskService.getTasks$(),
  );

  constructor(private taskService: TaskService) {}

  //ngOnInit(): void {}
}
