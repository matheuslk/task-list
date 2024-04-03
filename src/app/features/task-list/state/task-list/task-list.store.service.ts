import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IStateData } from 'src/app/shared/data/interfaces/state-data.interface';
import { ITaskList } from '../../data/interfaces/task-list.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskListStoreService {
  private updateTaskList$: BehaviorSubject<IStateData<ITaskList>> =
    new BehaviorSubject<IStateData<ITaskList>>({
      isLoading: false,
    });

  // SETTERS

  setUpdateTaskList(taskList: IStateData<ITaskList>): void {
    this.updateTaskList$.next(taskList);
  }

  // SELECTORS

  selectUpdateTaskList$(): Observable<IStateData<ITaskList>> {
    return this.updateTaskList$.asObservable();
  }
}
