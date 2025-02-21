import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeType } from '@ant-design/icons-angular';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { exhaustMap, map, Observable, Subject, take, tap } from 'rxjs';
import { TaskListEffectsModel } from '../../../../data/models/task-list.state.effects.model';
import { TaskListStateService } from '../../../../state/task-list/task-list.state.service';

const modules = [NzIconModule];

@Component({
  selector: 'app-pin-task-list',
  standalone: true,
  imports: [CommonModule, ...modules],
  templateUrl: './pin-task-list.component.html',
  styleUrls: ['./pin-task-list.component.less'],
})
export class PinTaskListComponent implements OnInit {
  private taskListStateService = inject(TaskListStateService);
  private taskListEffectsService = inject(TaskListEffectsModel);

  private taskList$ = this.taskListStateService.selectTaskListData$();

  theme$: Observable<ThemeType> = this.taskList$.pipe(
    map((taskList) => (taskList.isFixed ? 'fill' : 'outline')),
  );

  pinTaskList$: Subject<void> = new Subject();
  private pinTaskListListener$ = this.pinTaskList$.pipe(
    exhaustMap(() =>
      this.taskList$.pipe(
        take(1),
        tap((taskList) => {
          this.taskListEffectsService.updateTaskList({
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
