import { inject, Injectable } from '@angular/core';
import { TaskListStateEffectsModel } from '../../data/models/task-list.state.effects.model';
import { Observable, switchMap } from 'rxjs';
import {
  ITaskListsResponse,
  ITaskListWithTasksResponse,
} from '../../data/interfaces/task-list.interface';
import { HomeStateEffectsService } from '../home/home.state.effects.service';

@Injectable()
export class TaskListStateEffectsService extends TaskListStateEffectsModel {
  private homeStateEffectsService = inject(HomeStateEffectsService);
  constructor() {
    super();
    this.setListeners();
  }

  protected override updateTaskListOnSuccess$(
    updatedTaskList: ITaskListWithTasksResponse,
  ): Observable<any> {
    return this.refetchTasks$().pipe(
      switchMap(() => super.updateTaskListOnSuccess$(updatedTaskList)),
    );
  }

  protected override removeTaskListOnSuccess$(): Observable<any> {
    return this.refetchTasks$().pipe(
      switchMap(() => super.removeTaskListOnSuccess$()),
    );
  }

  private refetchTasks$(): Observable<ITaskListsResponse> {
    return this.homeStateEffectsService.fetchTaskLists$();
  }
}
