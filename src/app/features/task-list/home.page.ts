import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { TaskListsActionsComponent } from './components/task-list-actions/task-lists-actions.component';
import { TaskListsComponent } from './components/task-lists/task-lists.component';
import { HomeEffectsService } from './state/home/home.effects.service';
import { HomeStoreService } from './state/home/home.store.service';
import { filter, skip, take, takeUntil, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzGridModule,
    NzTypographyModule,
    TaskListsActionsComponent,
    TaskListsComponent,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.less'],
})
export class HomePage implements OnInit {
  homeStoreService = inject(HomeStoreService);
  homeEffectsService = inject(HomeEffectsService);

  taskLists$ = this.homeStoreService.selectTaskLists$();

  private initialLoadingListener$ = this.taskLists$.pipe(
    skip(1),
    filter((response) => !response.isLoading),
    take(1),
    tap(() => {
      this.homeStoreService.setIsInitialLoading(false);
    }),
    takeUntilDestroyed(),
  );

  ngOnInit(): void {
    this.setListeners();
    this.setData();
  }

  private setListeners(): void {
    this.initialLoadingListener$.subscribe();
  }

  private setData(): void {
    this.homeEffectsService.getTaskLists();
  }
}
