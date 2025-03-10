import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';
import { DEFAULT_MESSAGES } from '../../../../shared/data/consts/messages.const';
import { HomeStateService } from '../../shared/state/home/home.state.service';
import { TaskListsSectionComponent } from './components/task-lists-section/task-lists-section.component';

const modules = [NzDividerModule, NzTypographyModule, NzSkeletonModule];
const components = [TaskListsSectionComponent];

@Component({
  selector: 'app-task-lists',
  standalone: true,
  imports: [CommonModule, ...modules, ...components],
  templateUrl: './task-lists.component.html',
  styleUrls: ['./task-lists.component.less'],
})
export class TaskListsComponent {
  DEFAULT_MESSAGES = DEFAULT_MESSAGES;

  private homeStateService = inject(HomeStateService);

  taskLists$ = this.homeStateService.selectTaskLists$().pipe(shareReplay());

  private isInitialLoading$ = this.homeStateService.selectIsInitialLoading$();

  hasDefaultTasks$: Observable<boolean> = this.taskLists$.pipe(
    map(
      (taskLists) =>
        !!taskLists.data?.taskLists && taskLists.data.taskLists.length > 0,
    ),
    shareReplay(),
  );
  hasFixedTasks$: Observable<boolean> = this.taskLists$.pipe(
    map(
      (taskLists) => !!taskLists.data?.fixed && taskLists.data.fixed.length > 0,
    ),
    shareReplay(),
  );

  showLoader$: Observable<boolean> = combineLatest([
    this.taskLists$,
    this.isInitialLoading$,
  ]).pipe(
    map(
      ([taskLists, isInitialLoading]) =>
        taskLists.isLoading || isInitialLoading,
    ),
    shareReplay(),
  );

  isEmptyResults$: Observable<boolean> = combineLatest([
    this.taskLists$,
    this.showLoader$,
    this.hasDefaultTasks$,
    this.hasFixedTasks$,
  ]).pipe(
    map(
      ([taskLists, showLoader, hasDefaultTasks, hasFixedTasks]) =>
        !!taskLists?.data &&
        !showLoader &&
        !taskLists.error &&
        !hasDefaultTasks &&
        !hasFixedTasks,
    ),
    shareReplay(),
  );

  showTaskLists$: Observable<boolean> = combineLatest([
    this.taskLists$,
    this.showLoader$,
    this.isEmptyResults$,
  ]).pipe(
    map(
      ([taskLists, showLoader, isEmptyResults]) =>
        !taskLists.error && !showLoader && !isEmptyResults,
    ),
    shareReplay(),
  );
}
