import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, take, tap } from 'rxjs';
import { TaskListService } from './features/task-list/services/task-list.service';
import { TaskService } from './features/task-list/services/task.service';
import { TaskListsPage } from './features/task-list/task-lists.page';
import { LocalStorageKeysEnum } from './shared/data/enums/local-storage-keys.enum';
import { LocalStorageService } from './shared/services/local-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, TaskListsPage],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  taskListService = inject(TaskListService);
  taskService = inject(TaskService);
  localStorageService = inject(LocalStorageService);

  isLoadingData$ = new BehaviorSubject(true);
  private loadData$ = this.isLoadingData$.asObservable().pipe(
    take(1),
    tap(() => {
      if (this.localStorageService.getItem(LocalStorageKeysEnum.TASK_LISTS)) {
        return;
      }
      this.taskListService.load();
      this.taskService.load();
    }),
    tap(() => {
      this.isLoadingData$.next(false);
    }),
    takeUntilDestroyed(),
  );

  title = 'task-list';

  ngOnInit(): void {
    this.loadData$.subscribe();
  }
}
