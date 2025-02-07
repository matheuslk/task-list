import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  skip,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ITaskResponse } from 'src/app/features/task-list/data/interfaces/task.interface';
import { TaskEffectsService } from '../../state/task.effects.service';
import { ITaskListModalData } from '../../../../data/interfaces/task-list-modal-data.interface';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { TaskStateService } from '../../state/task.state.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCheckboxModule,
    NzInputModule,
    NzButtonModule,
  ],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.less'],
})
export class TaskItemComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('descriptionInput') descriptionInput: ElementRef<HTMLInputElement>;

  @Output() handleSelect = new EventEmitter<void>();
  @Output() handleUnselect = new EventEmitter<void>();

  @Input() task?: ITaskResponse;
  @Input({ required: true }) isSelected: boolean;
  isChecked$ = new BehaviorSubject<boolean | undefined>(undefined);
  description$ = new BehaviorSubject<string | undefined>(undefined);
  storeTask$ = new Subject<void>();
  updateTask$ = new Subject<void>();
  unselect$ = new Subject<void>();
  private readonly nzModalData: ITaskListModalData = inject(NZ_MODAL_DATA);
  private taskStateService = inject(TaskStateService);
  taskState$ = this.taskStateService.selectTaskState$();
  private taskEffectsService = inject(TaskEffectsService);
  private storeTaskListener$ = this.storeTask$.pipe(
    tap(() => {
      this.taskEffectsService.storeTask({
        description: this.description$.getValue() ?? '',
        isFinished: this.isChecked$.getValue() ?? false,
        taskListId: this.nzModalData.taskList.id,
      });
    }),
    takeUntilDestroyed(),
  );
  private updateTaskListener$ = this.updateTask$.pipe(
    tap(() => {
      const request: ITaskResponse = {
        ...(this.task as ITaskResponse),
        isFinished: this.isChecked$.getValue() ?? false,
        description: this.description$.getValue() ?? '',
      };
      this.taskEffectsService.updateTask(request);
    }),
    takeUntilDestroyed(),
  );
  private isCheckedListener$ = this.isChecked$.pipe(
    distinctUntilChanged(),
    skip(1),
    tap(() => {
      this.updateTask$.next();
    }),
    takeUntilDestroyed(),
  );
  private unselectListener$ = this.unselect$.pipe(
    switchMap(() => this.taskState$.pipe(take(1))),
    // Consider unselect only when task state is not loading to avoid dispatching unselect when input is disabled
    filter((taskState) => !taskState.isLoading),
    tap(() => {
      this.setTaskValue();
      this.handleUnselect.emit();
    }),
    takeUntilDestroyed(),
  );

  ngOnChanges(changes: SimpleChanges): void {
    const taskChanges = changes['task'];
    const isSelectedChanges = changes['isSelected'];

    if (taskChanges) {
      this.setTaskValue();
    }

    if (
      isSelectedChanges &&
      this.isSelected &&
      !isSelectedChanges.firstChange
    ) {
      this.descriptionInput.nativeElement.focus();
    }
  }

  ngOnInit(): void {
    this.storeTaskListener$.subscribe();
    this.updateTaskListener$.subscribe();
    this.isCheckedListener$.subscribe();
    this.unselectListener$.subscribe();
  }

  ngAfterViewInit(): void {
    if (this.isSelected) {
      this.descriptionInput.nativeElement.focus();
    }
  }

  handleSave(): void {
    this.task ? this.updateTask$.next() : this.storeTask$.next();
  }

  private setTaskValue(): void {
    if (!this.task) {
      return;
    }
    const { isFinished, description } = this.task;
    this.description$.next(description);
    this.isChecked$.next(isFinished);
  }
}
