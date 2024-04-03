import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, take, tap } from 'rxjs';
import { HomePage } from './features/task-list/home.page';
import { TaskListService } from './features/task-list/services/task-list.service';
import { TaskService } from './features/task-list/services/task.service';
import { LocalStorageKeysEnum } from './shared/data/enums/local-storage-keys.enum';
import { LocalStorageService } from './shared/services/local-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HomePage],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  taskListService = inject(TaskListService);
  taskService = inject(TaskService);
  localStorageService = inject(LocalStorageService);

  hasData$ = new BehaviorSubject(false);
  private loadDataListener$ = this.hasData$.asObservable().pipe(
    take(1),
    tap(() => {
      if (this.localStorageService.getItem(LocalStorageKeysEnum.TASK_LISTS)) {
        return;
      }
      this.taskListService.load();
      this.taskService.load();
    }),
    tap(() => {
      this.hasData$.next(true);
    }),
    takeUntilDestroyed(),
  );

  title = 'task-list';

  ngOnInit(): void {
    this.loadDataListener$.subscribe();
  }
}
