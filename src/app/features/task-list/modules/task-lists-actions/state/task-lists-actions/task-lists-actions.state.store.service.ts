import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class TaskListsActionsStateStoreService {
  private isStoringTaskList$: BehaviorSubject<boolean> = new BehaviorSubject(
    false,
  );

  // SETTERS

  setIsStoringTaskList(isStoringTaskList: boolean): void {
    this.isStoringTaskList$.next(isStoringTaskList);
  }

  // SELECTORS

  selectIsStoringTaskList$(): Observable<boolean> {
    return this.isStoringTaskList$.asObservable();
  }
}
