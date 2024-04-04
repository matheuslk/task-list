import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { Observable, combineLatest, map, shareReplay } from 'rxjs';
import { DEFAULT_MESSAGES } from '../../../../shared/data/consts/messages.const';
import { HomeStoreService } from '../../state/home/home.store.service';
import { TaskListsSectionComponent } from '../task-lists-section/task-lists-section.component';

@Component({
  selector: 'app-task-lists',
  standalone: true,
  imports: [
    CommonModule,
    NzDividerModule,
    NzSpinModule,
    NzTypographyModule,
    TaskListsSectionComponent,
  ],
  templateUrl: './task-lists.component.html',
  styleUrls: ['./task-lists.component.less'],
})
export class TaskListsComponent {
  DEFAULT_MESSAGES = DEFAULT_MESSAGES;

  homeStoreService = inject(HomeStoreService);

  taskLists$ = this.homeStoreService.selectTaskLists$().pipe(shareReplay());

  private isInitialLoading$ = this.homeStoreService.selectIsInitialLoading$();

  hasTasks$: Observable<boolean> = this.taskLists$.pipe(
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
    this.hasTasks$,
    this.hasFixedTasks$,
  ]).pipe(
    map(
      ([taskLists, showLoader, hasTasks, hasFixedTasks]) =>
        !!taskLists?.data &&
        !showLoader &&
        !taskLists.error &&
        !hasTasks &&
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
        !taskLists.error && (showLoader || !isEmptyResults),
    ),
    shareReplay(),
  );
}
