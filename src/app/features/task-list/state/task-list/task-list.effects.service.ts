import { Injectable, inject } from '@angular/core';
import {
  EMPTY,
  Subject,
  catchError,
  exhaustMap,
  filter,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { ITaskList } from '../../data/interfaces/task-list.interface';
import { TaskListService } from '../../services/task-list.service';
import { HomeStoreService } from '../home/home.store.service';
import { TaskListStoreService } from './task-list.store.service';
import { HomeEffectsService } from '../home/home.effects.service';

@Injectable({
  providedIn: 'root',
})
export class TaskListEffectsService {
  constructor() {
    this.updateTaskListListener$.subscribe();
  }

  private homeStoreService = inject(HomeStoreService);
  private homeEffectsService = inject(HomeEffectsService);
  private taskListStoreService = inject(TaskListStoreService);
  private taskListService = inject(TaskListService);

  private updateTaskList$: Subject<{
    taskList: ITaskList;
    updateList?: boolean;
  }> = new Subject();
  private updateTaskListListener$ = this.updateTaskList$.pipe(
    exhaustMap((updatedTaskListData) =>
      this.taskListStoreService.selectUpdateTaskList$().pipe(
        take(1),
        tap(() => {
          console.log('updateTaskListListener');
          if (updatedTaskListData.updateList) {
            this.homeStoreService.setIsUpdatingList(true);
          }
        }),
        tap((taskList) => {
          this.taskListStoreService.setUpdateTaskList({
            ...taskList,
            isLoading: true,
            error: undefined,
          });
        }),
        switchMap(() =>
          this.taskListService.updateTaskList$(updatedTaskListData.taskList),
        ),
        tap((taskList) => {
          this.taskListStoreService.setUpdateTaskList({
            data: taskList,
            isLoading: false,
          });
        }),
        filter(() => !!updatedTaskListData.updateList),
        switchMap(() => this.homeStoreService.selectSearch$()),
        take(1),
        tap((search) => {
          this.homeEffectsService.getTaskLists(search);
          this.homeStoreService.setIsUpdatingList(false);
        }),
        catchError((error) => {
          this.taskListStoreService.setUpdateTaskList({
            data: undefined,
            isLoading: false,
            error,
          });
          if (updatedTaskListData.updateList) {
            this.homeStoreService.setIsUpdatingList(false);
          }
          return EMPTY;
        }),
      ),
    ),
    takeUntil(this.homeStoreService.selectViewDestroyed$()),
  );

  updateTaskList(taskList: ITaskList, updateList?: boolean): void {
    this.updateTaskList$.next({ taskList, updateList });
  }
}
