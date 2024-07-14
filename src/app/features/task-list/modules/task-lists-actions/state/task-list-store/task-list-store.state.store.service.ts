import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IStateData } from 'src/app/core/data/interfaces/state-data.interface';
import { ITaskListResponse } from 'src/app/features/task-list/data/interfaces/task-list.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskListStoreStateStoreService {
  private storeTaskList$: BehaviorSubject<IStateData<ITaskListResponse>> =
    new BehaviorSubject<IStateData<ITaskListResponse>>({
      isLoading: false,
    });

  // SETTERS

  setStoreTaskList(storeTaskListState: IStateData<ITaskListResponse>): void {
    this.storeTaskList$.next(storeTaskListState);
  }

  // SELECTORS

  selectStoreTaskList$(): Observable<IStateData<ITaskListResponse>> {
    return this.storeTaskList$.asObservable();
  }
}
