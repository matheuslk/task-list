import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { BehaviorSubject, skip, tap } from 'rxjs';
import { ColorEnum } from '../../data/enums/color.enum';
import { Color } from '../../data/types/color.type';
import { GetBorderColorClassPipe } from '../../pipes/get-border-color-class.pipe';

@Component({
  selector: 'app-color-popover',
  standalone: true,
  imports: [
    CommonModule,
    NzPopoverModule,
    NzIconModule,
    NzColorPickerModule,
    GetBorderColorClassPipe,
  ],
  templateUrl: './color-popover.component.html',
  styleUrls: ['./color-popover.component.less'],
})
export class ColorPopoverComponent implements OnInit {
  @Output() visibilityChange = new EventEmitter<boolean>();
  @Output() colorSelect = new EventEmitter<Color | undefined>();
  @Input() selectedColor?: Color;

  colors = [ColorEnum.RED, ColorEnum.YELLOW, ColorEnum.BLUE];
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
    this.colorSelect.emit(color);
  }

  handleClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
