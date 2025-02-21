import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { BehaviorSubject, map, skip, tap } from 'rxjs';
import { GetColorValuePipe } from 'src/app/features/task-list/shared/components/task-list-options/pipes/get-color-value.pipe';
import { ColorEnum } from '../../../../data/enums/color.enum';
import { TaskListEffectsModel } from '../../../../data/models/task-list.state.effects.model';
import { Color } from '../../../../data/types/color.type';
import { GetBorderColorClassPipe } from '../../pipes/get-border-color-class.pipe';
import { TaskListStateService } from '../../../../state/task-list/task-list.state.service';

const modules = [NzPopoverModule, NzIconModule, NzColorPickerModule];
const pipes = [GetBorderColorClassPipe, GetColorValuePipe];

@Component({
  selector: 'app-color-popover',
  standalone: true,
  imports: [CommonModule, ...modules, ...pipes],
  templateUrl: './color-popover.component.html',
  styleUrls: ['./color-popover.component.less'],
})
export class ColorPopoverComponent implements OnInit {
  @Output() visibilityChange = new EventEmitter<boolean>();
  @Output() colorSelect = new EventEmitter<Color | undefined>();

  private taskListStateService = inject(TaskListStateService);
  private taskListEffectsService = inject(TaskListEffectsModel);

  private taskList$ = this.taskListStateService.selectTaskListData$();

  selectedColor$ = this.taskList$.pipe(map((taskList) => taskList.bgColor));
  colors = [ColorEnum.red, ColorEnum.yellow, ColorEnum.blue];
  isVisible$ = new BehaviorSubject(false);
  isVisibleListener$ = this.isVisible$.pipe(
    skip(1),
    tap((isVisible) => {
      this.visibilityChange.emit(isVisible);
    }),
    takeUntilDestroyed(),
  );

  ngOnInit(): void {
    this.isVisibleListener$.subscribe();
  }

  handleColorSelect(color?: Color): void {
    this.taskListEffectsService.updateTaskList({
      bgColor: color,
    });
  }
}
