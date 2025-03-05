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
  skip,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ITaskResponse } from 'src/app/features/task-list/shared/data/interfaces/task.interface';
import { TaskEffectsService } from '../../state/task/task.effects.service';
import { ITaskListModalData } from '../../data/interfaces/task-list-modal-data.interface';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { TaskStateService } from '../../state/task/task.state.service';
import { RemoveIconComponent } from '../../../../shared/components/remove-icon/remove-icon.component';

const modules = [FormsModule, NzCheckboxModule, NzInputModule, NzButtonModule];

const components = [RemoveIconComponent];

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, ...modules, ...components],
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
  removeTask$ = new Subject<string>();
  unselect$ = new Subject<void>();

  private taskStateService = inject(TaskStateService);

  taskState$ = this.taskStateService.selectTaskState$();

  private readonly nzModalData: ITaskListModalData = inject(NZ_MODAL_DATA);
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
  private removeTaskListener$ = this.removeTask$.pipe(
    tap((id: string) => {
      this.taskEffectsService.removeTask(id);
    }),
    takeUntilDestroyed(),
  );
  private isCheckedListener$ = this.isChecked$.pipe(
    distinctUntilChanged(),
    skip(1),
    tap(() => {
      const request: ITaskResponse = {
        ...(this.task as ITaskResponse),
        isFinished: this.isChecked$.getValue() ?? false,
      };
      this.taskEffectsService.updateTask(request);
    }),
    takeUntilDestroyed(),
  );
  private unselectListener$ = this.unselect$.pipe(
    switchMap(() => this.taskState$.pipe(take(1))),
    tap((taskState) => {
      // Reseta o valor da task no caso do usuário ter realizado alteração na descrição sem salvar
      if (!taskState.isLoading) {
        this.setTaskValue();
      }
      this.handleUnselect.emit();
    }),
    takeUntilDestroyed(),
  );

  ngOnChanges(changes: SimpleChanges): void {
    const taskChanges = changes['task'];

    if (taskChanges) {
      // Mantém os valores atualizados ao inicializar o componente e sempre que houver atualização de valores
      this.setTaskValue();
    }
  }

  ngOnInit(): void {
    this.storeTaskListener$.subscribe();
    this.updateTaskListener$.subscribe();
    this.removeTaskListener$.subscribe();
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
