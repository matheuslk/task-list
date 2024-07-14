import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, skip, take, tap } from 'rxjs/operators';

import { TaskListsActionsComponent } from './modules/task-lists-actions/task-lists-actions.component';
import { TaskListsComponent } from './modules/task-lists/task-lists.component';
import { HomeStateEffectsService } from './state/home/home.state.effects.service';
import { HomeStateStoreService } from './state/home/home.state.store.service';

const modules = [NzLayoutModule];
const components = [TaskListsActionsComponent, TaskListsComponent];

@Component({
  standalone: true,
  imports: [CommonModule, ...modules, ...components],
  providers: [HomeStateStoreService, HomeStateEffectsService],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.less'],
})
export class HomePage implements OnInit {
  homeStateStoreService = inject(HomeStateStoreService);
  homeStateEffectsService = inject(HomeStateEffectsService);

  taskLists$ = this.homeStateStoreService.selectTaskLists$();

  // TODO: Verificar possibilidade de remover trecho de código do componente e deixar apenas nos effects
  private initialLoadingListener$ = this.taskLists$.pipe(
    skip(1),
    filter((response) => !response.isLoading),
    take(1),
    tap(() => {
      this.homeStateStoreService.setIsInitialLoading(false);
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
    this.homeStateEffectsService.getTaskLists();
  }
}
