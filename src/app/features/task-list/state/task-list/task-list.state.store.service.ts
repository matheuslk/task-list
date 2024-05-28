import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IStateData } from 'src/app/core/data/interfaces/state-data.interface';
import { ITaskList } from '../../data/interfaces/task-list.interface';

@Injectable()
export class TaskListStateStoreService {
  private taskList$: BehaviorSubject<ITaskList | undefined> =
    new BehaviorSubject<ITaskList | undefined>(undefined);
  private updateTaskList$: BehaviorSubject<IStateData<ITaskList>> =
    new BehaviorSubject<IStateData<ITaskList>>({
      isLoading: false,
    });
  private removeTaskList$: BehaviorSubject<IStateData> =
    new BehaviorSubject<IStateData>({
      isLoading: false,
    });

  // SETTERS

  setTaskList(taskList: ITaskList): void {
    this.taskList$.next(taskList);
  }

  setUpdateTaskList(taskList: IStateData<ITaskList>): void {
    this.updateTaskList$.next(taskList);
  }

  setRemoveTaskList(taskList: IStateData<ITaskList>): void {
    this.updateTaskList$.next(taskList);
  }

  // SELECTORS

  selectTaskList$(): Observable<ITaskList | undefined> {
    return this.taskList$.asObservable();
  }

  selectUpdateTaskList$(): Observable<IStateData<ITaskList>> {
    return this.updateTaskList$.asObservable();
  }

  selectRemoveTaskList$(): Observable<IStateData<ITaskList>> {
    return this.removeTaskList$.asObservable();
  }
}
