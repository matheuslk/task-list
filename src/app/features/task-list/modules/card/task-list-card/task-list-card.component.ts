import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ITaskList } from '../../../data/interfaces/task-list.interface';
import { GetBgColorClassPipe } from '../../../pipes/get-bg-color-class.pipe';
import { TaskListStateEffectsService } from '../../../state/task-list/task-list.state.effects.service';
import { TaskListStateStoreService } from '../../../state/task-list/task-list.state.store.service';
import { TaskListCardFooterComponent } from '../components/task-list-card-footer/task-list-card-footer.component';
import { TaskListCardHeaderComponent } from '../components/task-list-card-header/task-list-card-header.component';
import { CardStoreService } from '../state/card/card.store.service';

const modules = [NzCardModule, NzTagModule];
const components = [TaskListCardHeaderComponent, TaskListCardFooterComponent];
const pipes = [GetBgColorClassPipe];

@Component({
  selector: 'app-task-list-card',
  standalone: true,
  imports: [CommonModule, ...modules, ...components, ...pipes],
  providers: [
    CardStoreService,
    TaskListStateStoreService,
    TaskListStateEffectsService,
  ],
  templateUrl: './task-list-card.component.html',
  styleUrls: ['./task-list-card.component.less'],
})
export class TaskListCardComponent implements OnChanges {
  private cardStoreService = inject(CardStoreService);
  private taskListStateStoreService = inject(TaskListStateStoreService);

  @HostListener('mouseenter')
  public mouseenterListener(): void {
    this.cardStoreService.setIsHovered(true);
  }

  @HostListener('mouseleave')
  public mouseleaveListener(): void {
    this.cardStoreService.setIsHovered(false);
  }

  @Input({ required: true }) taskList: ITaskList;

  taskList$ = this.taskListStateStoreService.selectTaskList$();
  showOptions$ = this.cardStoreService.selectShowOptions$();

  ngOnChanges(changes: SimpleChanges): void {
    const taskList = changes['taskList'];

    if (taskList.firstChange && this.taskList) {
      this.taskListStateStoreService.setTaskList(this.taskList);
    }
  }
}
