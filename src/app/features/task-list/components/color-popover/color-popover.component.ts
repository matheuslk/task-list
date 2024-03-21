import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { BehaviorSubject, skip, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-color-popover',
  standalone: true,
  imports: [CommonModule, NzPopoverModule, NzIconModule, NzColorPickerModule],
  templateUrl: './color-popover.component.html',
  styleUrls: ['./color-popover.component.less'],
})
export class ColorPopoverComponent implements OnInit {
  @Output() visibilityChange = new EventEmitter<boolean>();
  colors = ['#40a9ff', '#ffec3d', '#ff4d4f'];
  isVisible$ = new BehaviorSubject(false);
  isVisibleListener$ = this.isVisible$.pipe(
    skip(1),
    tap((isVisible) => {
      console.log('IS VISIBLE', isVisible);
      this.visibilityChange.emit(isVisible);
    }),
    takeUntilDestroyed(),
  );

  ngOnInit(): void {
    this.isVisibleListener$.subscribe();
  }

  handleColorSelect(): void {
    console.log('handleColorOnSelect');
  }

  handleColorClear(): void {
    console.log('clear');
  }

  handleClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
