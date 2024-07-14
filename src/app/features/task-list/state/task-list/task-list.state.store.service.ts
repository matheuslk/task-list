import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IStateData } from 'src/app/core/data/interfaces/state-data.interface';
import { ITaskListWithTasksResponse } from '../../data/interfaces/task-list.interface';

@Injectable()
export class TaskListStateStoreService {
  private taskList$: BehaviorSubject<ITaskListWithTasksResponse | undefined> =
    new BehaviorSubject<ITaskListWithTasksResponse | undefined>(undefined);
  private updateTaskList$: BehaviorSubject<
    IStateData<ITaskListWithTasksResponse>
  > = new BehaviorSubject<IStateData<ITaskListWithTasksResponse>>({
    isLoading: false,
  });
  private removeTaskList$: BehaviorSubject<IStateData> =
    new BehaviorSubject<IStateData>({
      isLoading: false,
    });

  // SETTERS

  setTaskList(taskListState: ITaskListWithTasksResponse): void {
    this.taskList$.next(taskListState);
  }

  setUpdateTaskList(
    updateTaskListState: IStateData<ITaskListWithTasksResponse>,
  ): void {
    this.updateTaskList$.next(updateTaskListState);
  }

  setRemoveTaskList(state: IStateData): void {
    this.removeTaskList$.next(state);
  }

  // SELECTORS

  selectTaskList$(): Observable<ITaskListWithTasksResponse | undefined> {
    return this.taskList$.asObservable();
  }

  selectUpdateTaskList$(): Observable<IStateData<ITaskListWithTasksResponse>> {
    return this.updateTaskList$.asObservable();
  }

  selectRemoveTaskList$(): Observable<IStateData> {
    return this.removeTaskList$.asObservable();
  }
}
