import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import {
  ITaskListsResponse,
  ITaskListWithTasksResponse,
} from '../../data/interfaces/task-list.interface';
import { TaskListEffectsModel } from '../../data/models/task-list.state.effects.model';
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
    return this.refetchTaskLists$().pipe(
      switchMap(() => super.updateTaskListOnSuccess$(updatedTaskList)),
    );
  }

  protected override removeTaskListOnSuccess$(): Observable<any> {
    return this.refetchTaskLists$().pipe(
      switchMap(() => super.removeTaskListOnSuccess$()),
    );
  }

  private refetchTaskLists$(): Observable<ITaskListsResponse> {
    return this.homeEffectsService.fetchTaskLists$();
  }
}
