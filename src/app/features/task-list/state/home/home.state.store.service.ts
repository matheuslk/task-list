import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IStateData } from 'src/app/core/data/interfaces/state-data.interface';
import { ITaskListResponse } from '../../data/interfaces/task-list.interface';

@Injectable()
export class HomeStateStoreService {
  private search$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private taskLists$: BehaviorSubject<IStateData<ITaskListResponse>> =
    new BehaviorSubject<IStateData<ITaskListResponse>>({
      isLoading: false,
    });

  private isInitialLoading$: BehaviorSubject<boolean> = new BehaviorSubject(
    true,
  );
  private isUpdatingList$: BehaviorSubject<boolean> = new BehaviorSubject(
    false,
  );

  // SETTERS

  setSearch(search: string): void {
    this.search$.next(search);
  }

  setTaskLists(taskLists: IStateData<ITaskListResponse>): void {
    this.taskLists$.next(taskLists);
  }

  setIsInitialLoading(isInitialLoading: boolean): void {
    this.isInitialLoading$.next(isInitialLoading);
  }

  // SELECTORS

  selectSearch$(): Observable<string> {
    return this.search$.asObservable();
  }

  selectTaskLists$(): Observable<IStateData<ITaskListResponse>> {
    return this.taskLists$.asObservable();
  }

  selectIsInitialLoading$(): Observable<boolean> {
    return this.isInitialLoading$.asObservable();
  }

  selectIsUpdatingList$(): Observable<boolean> {
    return this.isUpdatingList$.asObservable();
  }
}
