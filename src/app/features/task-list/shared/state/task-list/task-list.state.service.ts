import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, shareReplay } from 'rxjs';
import { IStateData } from 'src/app/core/data/interfaces/state-data.interface';
import { ITaskListWithTasksResponse } from '../../data/interfaces/task-list.interface';

@Injectable()
export class TaskListStateService {
  private taskList$: BehaviorSubject<IStateData<ITaskListWithTasksResponse>> =
    new BehaviorSubject<IStateData<ITaskListWithTasksResponse>>({
      isLoading: false,
    });
  private taskListData$ = this.taskList$.asObservable().pipe(
    map((taskList) => taskList.data),
    filter((taskList): taskList is ITaskListWithTasksResponse => !!taskList),
    shareReplay(1),
  );

  // SETTERS

  setTaskList(taskList: IStateData<ITaskListWithTasksResponse>): void {
    this.taskList$.next(taskList);
  }

  // SELECTORS

  selectTaskListState$(): Observable<IStateData<ITaskListWithTasksResponse>> {
    return this.taskList$.asObservable();
  }

  selectTaskListData$(): Observable<ITaskListWithTasksResponse> {
    return this.taskListData$;
  }
}
