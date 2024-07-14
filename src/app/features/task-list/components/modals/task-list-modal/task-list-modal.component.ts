import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';
import {
  BehaviorSubject,
  EMPTY,
  debounceTime,
  delay,
  distinctUntilChanged,
  exhaustMap,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-task-list-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzCheckboxModule,
    NzIconModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './task-list-modal.component.html',
  styleUrls: ['./task-list-modal.component.less'],
})
export class TaskListModalComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

  readonly nzModalData: ITaskListModalData = inject(NZ_MODAL_DATA);

  taskChecksForm = this.fb.array<FormControl<boolean>>([]);

  updatingTask$: BehaviorSubject<ITask | null> =
    new BehaviorSubject<ITask | null>(null);
  private updatingTaskListener$ = this.updatingTask$.asObservable().pipe(
    filter((task) => !!task),
    exhaustMap((task) =>
      this.updatingTask$.asObservable().pipe(
        map((task) => task?.description),
        debounceTime(300),
        distinctUntilChanged(),
        tap((description) => {
          console.log('UPDATING TASK', description);
        }),
        delay(2000),
        tap(() => {
          console.log('SAVED', task?.description);
        }),
        switchMap(() => EMPTY),
      ),
    ),
    takeUntilDestroyed(),
  );

  ngOnInit(): void {
    this.setListeners();
    this.setForm();
  }

  setListeners(): void {
    this.updatingTaskListener$.subscribe();
  }

  setForm(): void {
    // if (!this.nzModalData.taskList.tasks) {
    //   return;
    // }
    // this.nzModalData.taskList.tasks.forEach(() => {
    //   this.taskChecksForm.push(this.fb.control(false) as FormControl);
    // });
  }

  handleUpdateTaskDescription(description: string): void {
    const updatedTask: ITask = {
      ...(this.updatingTask$.getValue() as ITask),
      description,
    };
    this.updatingTask$.next(updatedTask);
  }

  showFormValue(): void {
    console.log('Form value', this.taskChecksForm.value);
  }
}
