import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  BehaviorSubject,
  Subject,
  distinctUntilChanged,
  filter,
  tap,
} from 'rxjs';
import { TaskListCardOptionsComponent } from '../../../../cards/task-list-card/components/task-list-card-options/task-list-card-options.component';
import { TaskListCardHeader } from '../../../../cards/task-list-card/data/models/task-list-card-header.model';

const modules = [NzTypographyModule, NzInputModule, NzFormModule, FormsModule];
const components = [TaskListCardOptionsComponent];

@Component({
  selector: 'app-task-list-modal-header',
  standalone: true,
  imports: [CommonModule, ...modules, ...components],
  templateUrl: './task-list-modal-header.component.html',
  styleUrls: ['./task-list-modal-header.component.less'],
})
export class TaskListModalHeaderComponent
  extends TaskListCardHeader
  implements OnInit, AfterViewInit
{
  @ViewChild('titleInput')
  private titleInput: ElementRef<HTMLInputElement>;

  title$ = new BehaviorSubject('');

  private taskListListener$ = this.taskList$.pipe(
    filter((taskList) => !!taskList),
    tap((taskList) => {
      this.title$.next(taskList?.title ?? '');
    }),
    takeUntilDestroyed(),
  );

  saveTitle$: Subject<string> = new Subject();
  private saveTitleListener$ = this.saveTitle$.pipe(
    distinctUntilChanged(),
    tap((title) => {
      this.taskListStateEffectsService.updateTaskList({
        title,
      });
    }),
    takeUntilDestroyed(),
  );

  ngOnInit(): void {
    this.setListeners();
  }

  ngAfterViewInit(): void {
    this.titleInput.nativeElement.focus();
  }

  protected override setListeners(): void {
    super.setListeners();
    this.taskListListener$.subscribe();
    this.saveTitleListener$.subscribe();
  }
}
