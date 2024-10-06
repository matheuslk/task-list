import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HomeStateService } from '../../state/home/home.state.service';
import { SearchComponent } from './components/search/search.component';
import { TaskListStoreComponent } from './components/task-list-store/task-list-store.component';
import { TaskListsActionsStateService } from './state/task-lists-actions/task-lists-actions.state.service';
import { combineLatest, map } from 'rxjs';
import { TaskListModalComponent } from '../modals/task-list-modal/task-list-modal.component';

const modules = [NzButtonModule, NzIconModule];
const components = [
  SearchComponent,
  TaskListStoreComponent,
  TaskListModalComponent,
];

@Component({
  selector: 'app-task-lists-actions',
  standalone: true,
  imports: [CommonModule, ...modules, ...components],
  providers: [TaskListsActionsStateService],
  templateUrl: './task-lists-actions.component.html',
  styleUrls: ['./task-lists-actions.component.less'],
})
export class TaskListsActionsComponent {
  private taskListsActionsStateService = inject(TaskListsActionsStateService);
  private homeStateService = inject(HomeStateService);

  isInitialLoading$ = this.homeStateService.selectIsInitialLoading$();
  isStoringTaskList$ =
    this.taskListsActionsStateService.selectIsStoringTaskList$();

  isLoadingTaskLists$ = combineLatest([
    this.isInitialLoading$,
    this.homeStateService.selectTaskLists$(),
  ]).pipe(
    map(
      ([isInitialLoading, taskLists]) =>
        isInitialLoading || taskLists.isLoading,
    ),
  );

  setIsStoringTaskList(isStoringTaskList: boolean): void {
    this.taskListsActionsStateService.setIsStoringTaskList(isStoringTaskList);
  }
}
