import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IStateData } from 'src/app/core/data/interfaces/state-data.interface';
import { ITaskListsResponse } from '../../data/interfaces/task-list.interface';

@Injectable({
  providedIn: 'root',
})
export class HomeStateService {
  private search$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private taskLists$: BehaviorSubject<IStateData<ITaskListsResponse>> =
    new BehaviorSubject<IStateData<ITaskListsResponse>>({
      isLoading: false,
    });

  private isInitialLoading$: BehaviorSubject<boolean> = new BehaviorSubject(
    true,
  );

  // SETTERS

  setSearch(search: string): void {
    this.search$.next(search);
  }

  setTaskLists(taskLists: IStateData<ITaskListsResponse>): void {
    this.taskLists$.next({ ...taskLists });
  }

  setIsInitialLoading(isInitialLoading: boolean): void {
    this.isInitialLoading$.next(isInitialLoading);
  }

  // SELECTORS

  selectSearch$(): Observable<string> {
    return this.search$.asObservable();
  }

  selectTaskLists$(): Observable<IStateData<ITaskListsResponse>> {
    return this.taskLists$.asObservable();
  }

  selectIsInitialLoading$(): Observable<boolean> {
    return this.isInitialLoading$.asObservable();
  }
}
