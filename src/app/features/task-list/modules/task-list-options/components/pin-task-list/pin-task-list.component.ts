import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeType } from '@ant-design/icons-angular';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { exhaustMap, map, Observable, Subject, take, tap } from 'rxjs';
import { TaskListStateEffectsModel } from '../../../../data/models/task-list.state.effects.model';
import { TaskListStateStoreService } from '../../../../state/task-list/task-list.state.store.service';

const modules = [NzIconModule];

@Component({
  selector: 'app-pin-task-list',
  standalone: true,
  imports: [CommonModule, ...modules],
  templateUrl: './pin-task-list.component.html',
  styleUrls: ['./pin-task-list.component.less'],
})
export class PinTaskListComponent implements OnInit {
  private taskListStateStoreService = inject(TaskListStateStoreService);
  private taskListStateEffectsService = inject(TaskListStateEffectsModel);

  private taskList$ = this.taskListStateStoreService.selectTaskListData$();

  theme$: Observable<ThemeType> = this.taskList$.pipe(
    map((taskList) => (taskList.isFixed ? 'fill' : 'outline')),
  );

  pinTaskList$: Subject<void> = new Subject();
  private pinTaskListListener$ = this.pinTaskList$.pipe(
    exhaustMap(() =>
      this.taskList$.pipe(
        take(1),
        tap((taskList) => {
          this.taskListStateEffectsService.updateTaskList({
            isFixed: !taskList.isFixed,
          });
        }),
      ),
    ),
    takeUntilDestroyed(),
  );

  ngOnInit(): void {
    this.setListeners();
  }

  private setListeners(): void {
    this.pinTaskListListener$.subscribe();
  }
}
