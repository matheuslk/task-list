import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { Subject, exhaustMap, take, tap } from 'rxjs';
import { ColorPopoverComponent } from 'src/app/features/task-list/components/color-popover/color-popover.component';
import { ITaskList } from 'src/app/features/task-list/data/interfaces/task-list.interface';
import { Color } from 'src/app/features/task-list/data/types/color.type';

import { TaskListStateEffectsService } from 'src/app/features/task-list/state/task-list/task-list.state.effects.service';
import { TaskListStateStoreService } from 'src/app/features/task-list/state/task-list/task-list.state.store.service';
import { CardStoreService } from '../../state/card/card.store.service';

@Component({
  selector: 'app-task-list-card-header',
  standalone: true,
  imports: [
    CommonModule,
    NzBadgeModule,
    NzIconModule,
    NzTypographyModule,
    ColorPopoverComponent,
  ],
  templateUrl: './task-list-card-header.component.html',
  styleUrls: ['./task-list-card-header.component.less'],
})
export class TaskListCardHeaderComponent implements OnInit {
  private taskListStateStoreService = inject(TaskListStateStoreService);
  private taskListStateEffectsService = inject(TaskListStateEffectsService);
  private cardStoreService = inject(CardStoreService);

  taskList$ = this.taskListStateStoreService.selectTaskList$();
  showOptions$ = this.cardStoreService.selectShowOptions$();

  pinTask$ = new Subject<void>();
  private pinTaskListener$ = this.pinTask$.pipe(
    exhaustMap(() =>
      this.taskListStateStoreService.selectTaskList$().pipe(
        take(1),
        tap((currentTaskList) => {
          this.taskListStateEffectsService.updateTaskList(
            {
              ...(currentTaskList as ITaskList),
              isFixed: !currentTaskList?.isFixed,
            },
            true,
          );
        }),
      ),
    ),
    takeUntilDestroyed(),
  );

  colorSelect$ = new Subject<Color | undefined>();
  private colorSelectListener$ = this.colorSelect$.pipe(
    exhaustMap((color) =>
      this.taskListStateStoreService.selectTaskList$().pipe(
        take(1),
        tap((currentTaskList) => {
          this.taskListStateEffectsService.updateTaskList({
            ...(currentTaskList as ITaskList),
            bgColor: color,
          });
        }),
      ),
    ),
    takeUntilDestroyed(),
  );

  ngOnInit(): void {
    this.pinTaskListener$.subscribe();
    this.colorSelectListener$.subscribe();
  }

  handleVisibilityChange(isFixed: boolean): void {
    this.cardStoreService.setIsFixed(isFixed);
  }
}
