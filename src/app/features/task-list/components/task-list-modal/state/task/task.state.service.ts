import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, shareReplay } from 'rxjs';
import { IStateData } from 'src/app/core/data/interfaces/state-data.interface';
import { ITaskResponse } from 'src/app/features/task-list/shared/data/interfaces/task.interface';

@Injectable()
export class TaskStateService {
  private task$: BehaviorSubject<IStateData<ITaskResponse>> =
    new BehaviorSubject<IStateData<ITaskResponse>>({
      isLoading: false,
    });
  private taskData$ = this.task$.asObservable().pipe(
    map((task) => task.data),
    filter((task): task is ITaskResponse => !!task),
    shareReplay(1),
  );

  // SETTERS

  setTask(task: IStateData<ITaskResponse>): void {
    this.task$.next(task);
  }

  // SELECTORS

  selectTaskState$(): Observable<IStateData<ITaskResponse>> {
    return this.task$.asObservable();
  }

  selectTaskData$(): Observable<ITaskResponse> {
    return this.taskData$;
  }
}
