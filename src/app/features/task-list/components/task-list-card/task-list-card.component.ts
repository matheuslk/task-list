import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Subject, tap } from 'rxjs';
import { ITaskListWithTasksResponse } from '../../shared/data/interfaces/task-list.interface';
import { TaskListEffectsModel } from '../../shared/data/models/task-list.state.effects.model';
import { GetBgColorClassPipe } from './pipes/get-bg-color-class.pipe';
import { TaskListEffectsService } from '../../shared/state/task-list/task-list.effects.service';
import { TaskListStateService } from '../../shared/state/task-list/task-list.state.service';
import { TaskListModalControllerEffectsService } from '../../shared/state/task-list-modal-controller.state.effects.service';
import { TaskListCardFooterComponent } from './components/task-list-card-footer/task-list-card-footer.component';
import { TaskListCardHeaderComponent } from './components/task-list-card-header/task-list-card-header.component';
import { TaskListCardStateService } from './state/task-list-card.state.service';

const modules = [NzCardModule, NzTagModule];
const components = [TaskListCardHeaderComponent, TaskListCardFooterComponent];
const pipes = [GetBgColorClassPipe];

@Component({
  selector: 'app-task-list-card',
  standalone: true,
  imports: [CommonModule, ...modules, ...components, ...pipes],
  providers: [
    TaskListCardStateService,
    TaskListStateService,
    TaskListEffectsService,
    {
      provide: TaskListEffectsModel,
      useExisting: TaskListEffectsService,
    },
  ],
  templateUrl: './task-list-card.component.html',
  styleUrls: ['./task-list-card.component.less'],
})
export class TaskListCardComponent implements OnInit, OnChanges {
  private taskListCardStateService = inject(TaskListCardStateService);
  private taskListStateService = inject(TaskListStateService);
  private taskListModalControllerEffectsService = inject(
    TaskListModalControllerEffectsService,
  );

  @HostListener('mouseenter')
  public mouseenterListener(): void {
    this.taskListCardStateService.setIsHovered(true);
  }

  @HostListener('mouseleave')
  public mouseleaveListener(): void {
    this.taskListCardStateService.setIsHovered(false);
  }

  @Input({ required: true }) taskList: ITaskListWithTasksResponse;

  openModal$ = new Subject<void>();
  private openModalListener$ = this.openModal$.pipe(
    tap(() => {
      this.taskListModalControllerEffectsService.create(this.taskList);
    }),
    takeUntilDestroyed(),
  );

  taskList$ = this.taskListStateService.selectTaskListData$();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskList'].firstChange) {
      return;
    }
    this.taskListStateService.setTaskList({
      data: this.taskList,
      isLoading: false,
    });
  }

  ngOnInit(): void {
    this.taskListStateService.setTaskList({
      data: this.taskList,
      isLoading: false,
    });
    this.openModalListener$.subscribe();
  }
}
