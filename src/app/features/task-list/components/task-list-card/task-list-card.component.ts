import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { BehaviorSubject, combineLatest, map, shareReplay } from 'rxjs';
import { ITaskList } from '../../data/interfaces/task-list.interface';
import { HomeStoreService } from '../../state/home/home.store.service';
import { TaskListEffectsService } from '../../state/task-list/task-list.effects.service';
import { ColorPopoverComponent } from '../color-popover/color-popover.component';

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
  @Input({ required: true }) taskList: ITaskList;

  homeStoreService = inject(HomeStoreService);
  taskListEffectsService = inject(TaskListEffectsService);

  private isLoadingList$ = this.homeStoreService
    .selectTaskLists$()
    .pipe(map((taskLists) => taskLists.isLoading));
  private isUpdatingList$ = this.homeStoreService.selectIsUpdatingList$();

  isLoading$ = combineLatest([this.isLoadingList$, this.isUpdatingList$]).pipe(
    map(([isLoadingList, isUpdatingList]) => isLoadingList || isUpdatingList),
    shareReplay(),
  );
  isFixed$ = new BehaviorSubject(false);

  pinTaskList(): void {
    this.taskListEffectsService.updateTaskList(
      {
        ...this.taskList,
        isFixed: !this.taskList.isFixed,
      },
      true,
    );
  }
}
