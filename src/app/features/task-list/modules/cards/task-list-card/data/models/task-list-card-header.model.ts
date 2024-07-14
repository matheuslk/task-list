import { Directive, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, exhaustMap, take, tap } from 'rxjs';
import { Color } from 'src/app/features/task-list/data/types/color.type';
import { TaskListStateEffectsService } from 'src/app/features/task-list/state/task-list/task-list.state.effects.service';
import { TaskListStateStoreService } from 'src/app/features/task-list/state/task-list/task-list.state.store.service';

@Directive()
export class TaskListCardHeader {
  protected taskListStateStoreService = inject(TaskListStateStoreService);
  protected taskListStateEffectsService = inject(TaskListStateEffectsService);

  taskList$ = this.taskListStateStoreService.selectTaskList$();

  pinTask$ = new Subject<boolean>();
  protected pinTaskListener$ = this.pinTask$.pipe(
    exhaustMap((refetchTaskLists) =>
      this.taskList$.pipe(
        take(1),
        tap((taskList) => {
          this.taskListStateEffectsService.updateTaskList(
            {
              isFixed: !taskList?.isFixed,
            },
            refetchTaskLists,
          );
        }),
      ),
    ),
    takeUntilDestroyed(),
  );

  colorSelect$ = new Subject<Color | undefined>();
  protected colorSelectListener$ = this.colorSelect$.pipe(
    tap((color) => {
      this.taskListStateEffectsService.updateTaskList({
        bgColor: color,
      });
    }),
    takeUntilDestroyed(),
  );

  protected setListeners(): void {
    this.pinTaskListener$.subscribe();
    this.colorSelectListener$.subscribe();
  }
}
