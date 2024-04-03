import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IStateData } from 'src/app/shared/data/interfaces/state-data.interface';
import { ITask, ITaskList } from '../../data/interfaces/task-list.interface';

@Injectable()
export class TaskListModalStoreService {
  private taskList$: BehaviorSubject<IStateData<ITaskList>> =
    new BehaviorSubject<IStateData<ITaskList>>({
      isLoading: false,
    });
  private updateTask$: BehaviorSubject<IStateData<ITask>> = new BehaviorSubject<
    IStateData<ITask>
  >({
    isLoading: false,
  });
  private removeTask$: BehaviorSubject<IStateData<ITask>> = new BehaviorSubject<
    IStateData<ITask>
  >({
    isLoading: false,
  });
  private viewDestroyed$: Subject<void> = new Subject();

  // SETTERS

  setTaskList(taskList: IStateData<ITaskList>): void {
    this.taskList$.next(taskList);
  }

  setUpdateTask(taskList: IStateData<ITask>): void {
    this.updateTask$.next(taskList);
  }

  setRemoveTask(taskList: IStateData<ITask>): void {
    this.removeTask$.next(taskList);
  }

  destroy$(): void {
    this.viewDestroyed$.next();
  }

  // SELECTORS

  selectTaskList$(): Observable<IStateData<ITaskList>> {
    return this.taskList$.asObservable();
  }

  selectUpdateTask$(): Observable<IStateData<ITask>> {
    return this.updateTask$.asObservable();
  }

  selectRemoveTask$(): Observable<IStateData<ITask>> {
    return this.removeTask$.asObservable();
  }

  selectViewDestroyed$(): Observable<void> {
    return this.viewDestroyed$.asObservable();
  }
}
