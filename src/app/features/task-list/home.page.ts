import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, skip, take, tap } from 'rxjs/operators';
import { TaskListsActionsComponent } from './components/task-lists-actions/task-lists-actions.component';
import { TaskListsComponent } from './components/task-lists/task-lists.component';
import { HomeEffectsService } from './shared/state/home/home.effects.service';
import { HomeStateService } from './shared/state/home/home.state.service';

const modules = [NzLayoutModule];
const components = [TaskListsActionsComponent, TaskListsComponent];

@Component({
  standalone: true,
  imports: [CommonModule, ...modules, ...components],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.less'],
})
export class HomePage implements OnInit {
  homeStateService = inject(HomeStateService);
  homeEffectsService = inject(HomeEffectsService);

  taskLists$ = this.homeStateService.selectTaskLists$();

  // TODO: Verificar possibilidade de remover trecho de código do componente e deixar apenas nos effects
  private initialLoadingListener$ = this.taskLists$.pipe(
    skip(1),
    filter((response) => !response.isLoading),
    take(1),
    tap(() => {
      this.homeStateService.setIsInitialLoading(false);
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
