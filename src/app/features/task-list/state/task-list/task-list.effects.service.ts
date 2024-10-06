import { inject, Injectable } from '@angular/core';
import { TaskListEffectsModel } from '../../data/models/task-list.state.effects.model';
import { Observable, switchMap } from 'rxjs';
import {
  ITaskListsResponse,
  ITaskListWithTasksResponse,
} from '../../data/interfaces/task-list.interface';
import { HomeEffectsService } from '../home/home.effects.service';

@Injectable()
export class TaskListEffectsService extends TaskListEffectsModel {
  private homeEffectsService = inject(HomeEffectsService);
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
    return this.homeEffectsService.fetchTaskLists$();
  }
}
