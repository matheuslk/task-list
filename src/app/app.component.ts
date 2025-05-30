import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, take, tap } from 'rxjs';
import { LocalStorageKeysEnum } from './core/data/enums/local-storage-keys.enum';
import { GlobalLoaderService } from './core/services/global-loader.service';
import { LocalStorageService } from './core/services/local-storage.service';
import { GlobalStateService } from './core/state/global.state.service';
import { TaskListService } from './features/task-list/shared/services/task-list.service';
import { TaskService } from './features/task-list/components/task-list-modal/services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  private globalStateService = inject(GlobalStateService);
  private globalLoaderService = inject(GlobalLoaderService);
  private taskListService = inject(TaskListService);
  private taskService = inject(TaskService);
  private localStorageService = inject(LocalStorageService);

  private isLoading$ = this.globalStateService.selectIsLoading$();
  // TODO: Verificar possibilidade de remover trecho de código do componente e deixar apenas nos effects
  private globalLoadingListener$ = this.isLoading$.pipe(
    distinctUntilChanged(),
    tap((isLoading) => {
      if (isLoading) {
        document.body.classList.add('hide-overflow');
        this.globalLoaderService.create();
        return;
      }
      document.body.classList.remove('hide-overflow');
      this.globalLoaderService.destroy();
    }),
    takeUntilDestroyed(),
  );

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
    this.globalLoadingListener$.subscribe();
    this.loadDataListener$.subscribe();
  }
}
