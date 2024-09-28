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
import { ITaskListWithTasksResponse } from '../../../data/interfaces/task-list.interface';
import { TaskListStateEffectsModel } from '../../../data/models/task-list.state.effects.model';
import { GetBgColorClassPipe } from '../../../pipes/get-bg-color-class.pipe';
import { TaskListStateEffectsService } from '../../../state/task-list/task-list.state.effects.service';
import { TaskListStateStoreService } from '../../../state/task-list/task-list.state.store.service';
import { TaskListModalControllerStateEffectsService } from '../../modals/task-list-modal/state/task-list-modal-controller/task-list-modal-controller.state.effects.service';
import { TaskListCardFooterComponent } from './components/task-list-card-footer/task-list-card-footer.component';
import { TaskListCardHeaderComponent } from './components/task-list-card-header/task-list-card-header.component';
import { TaskListCardStateStoreService } from './state/task-list-card.state.store.service';

const modules = [NzCardModule, NzTagModule];
const components = [TaskListCardHeaderComponent, TaskListCardFooterComponent];
const pipes = [GetBgColorClassPipe];

@Component({
  selector: 'app-task-list-card',
  standalone: true,
  imports: [CommonModule, ...modules, ...components, ...pipes],
  providers: [
    TaskListCardStateStoreService,
    TaskListStateStoreService,
    TaskListStateEffectsService,
    {
      provide: TaskListStateEffectsModel,
      useExisting: TaskListStateEffectsService,
    },
  ],
  templateUrl: './task-list-card.component.html',
  styleUrls: ['./task-list-card.component.less'],
})
export class TaskListCardComponent implements OnInit, OnChanges {
  private taskListCardStateStoreService = inject(TaskListCardStateStoreService);
  private taskListStateStoreService = inject(TaskListStateStoreService);
  private taskListModalControllerStateEffectsService = inject(
    TaskListModalControllerStateEffectsService,
  );

  @HostListener('mouseenter')
  public mouseenterListener(): void {
    this.taskListCardStateStoreService.setIsHovered(true);
  }

  @HostListener('mouseleave')
  public mouseleaveListener(): void {
    this.taskListCardStateStoreService.setIsHovered(false);
  }

  @Input({ required: true }) taskList: ITaskListWithTasksResponse;

  openModal$ = new Subject<void>();
  private openModalListener$ = this.openModal$.pipe(
    tap(() => {
      this.taskListModalControllerStateEffectsService.create(this.taskList);
    }),
    takeUntilDestroyed(),
  );

  taskList$ = this.taskListStateStoreService.selectTaskListData$();

  ngOnInit(): void {
    this.taskListStateStoreService.setTaskList({
      data: this.taskList,
      isLoading: false,
    });
    this.openModalListener$.subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskList'].firstChange) {
      return;
    }
    this.taskListStateStoreService.setTaskList({
      data: this.taskList,
      isLoading: false,
    });
  }
}
