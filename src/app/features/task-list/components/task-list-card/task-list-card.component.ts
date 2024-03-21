import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { BehaviorSubject } from 'rxjs';
import { ITaskListModalData } from '../../data/interfaces/modal-data.interface';
import { ITaskList } from '../../data/interfaces/task.interface';
import { ColorPopoverComponent } from '../color-popover/color-popover.component';
import { TaskListModalComponent } from '../modal/task-list-modal/task-list-modal.component';

@Component({
  selector: 'app-task-list-card',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzTagModule,
    NzBadgeModule,
    NzIconModule,
    NzModalModule,
    ColorPopoverComponent,
  ],
  templateUrl: './task-list-card.component.html',
  styleUrls: ['./task-list-card.component.less'],
})
export class TaskListCardComponent {
  constructor(private modalService: NzModalService) {}

  @Input({ required: true }) taskList: ITaskList;

  isFixed$ = new BehaviorSubject(false);

  handleOpenModal(): void {
    const modalData: ITaskListModalData = {
      taskList: this.taskList,
    };
    this.modalService.create({
      nzTitle: 'Edite suas tarefas',
      nzContent: TaskListModalComponent,
      nzData: modalData,
    });
  }
}
