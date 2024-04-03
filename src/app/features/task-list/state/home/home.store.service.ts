import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IStateData } from 'src/app/shared/data/interfaces/state-data.interface';
import { ITaskListResponse } from '../../data/interfaces/task-list.interface';

@Injectable({
  providedIn: 'root',
})
export class HomeStoreService {
  constructor() {
    console.log('HomeStoreService');
  }

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

  private viewDestroyed$: Subject<void> = new Subject();

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

  setIsUpdatingList(isUpdatingList: boolean): void {
    this.isUpdatingList$.next(isUpdatingList);
  }

  destroy$(): void {
    this.viewDestroyed$.next();
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

  selectViewDestroyed$(): Observable<void> {
    return this.viewDestroyed$.asObservable();
  }
}
