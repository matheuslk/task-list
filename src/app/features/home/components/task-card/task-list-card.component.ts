import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ITaskList } from 'src/app/features/task/data/interfaces/task.interface';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';

@Component({
  selector: 'app-task-list-card',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzTagModule,
    NzBadgeModule,
    NzIconModule,
    NzColorPickerModule,
  ],
  templateUrl: './task-list-card.component.html',
  styleUrls: ['./task-list-card.component.less'],
})
export class TaskListCardComponent implements OnInit {
  @Input({ required: true }) taskList: ITaskList;

  bgColors: string[];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.bgColors = ['#40a9ff', '#ffec3d', '#ff4d4f'];
  }

  navigateToTaskList(): void {
    //this.router.navigate([URLS['TASK-LIST'], this.task.id]);
  }
}
