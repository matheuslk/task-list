import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HomeStateStoreService } from '../../state/home/home.state.store.service';
import { SearchComponent } from './components/search/search.component';
import { TaskListStoreComponent } from './components/task-list-store/task-list-store.component';
import { TaskListsActionsStateStoreService } from './state/task-lists-actions/task-lists-actions.state.store.service';
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
  providers: [TaskListsActionsStateStoreService],
  templateUrl: './task-lists-actions.component.html',
  styleUrls: ['./task-lists-actions.component.less'],
})
export class TaskListsActionsComponent {
  private taskListsActionsStateStoreService = inject(
    TaskListsActionsStateStoreService,
  );
  private homeStateStoreService = inject(HomeStateStoreService);

  isInitialLoading$ = this.homeStateStoreService.selectIsInitialLoading$();
  isStoringTaskList$ =
    this.taskListsActionsStateStoreService.selectIsStoringTaskList$();

  isLoadingTaskLists$ = combineLatest([
    this.isInitialLoading$,
    this.homeStateStoreService.selectTaskLists$(),
  ]).pipe(
    map(
      ([isInitialLoading, taskLists]) =>
        isInitialLoading || taskLists.isLoading,
    ),
  );

  setIsStoringTaskList(isStoringTaskList: boolean): void {
    this.taskListsActionsStateStoreService.setIsStoringTaskList(
      isStoringTaskList,
    );
  }
}
