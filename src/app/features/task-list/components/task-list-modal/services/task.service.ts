import { inject, Injectable } from '@angular/core';

import { LocalStorageKeysEnum } from 'src/app/core/data/enums/local-storage-keys.enum';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { TASKS } from '../../../shared/data/mocks/task.mock';

import { delay, Observable, of } from 'rxjs';

import { v4 as uuidv4 } from 'uuid';
import {
  ITaskRequest,
  ITaskResponse,
} from '../../../shared/data/interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private localStorageService = inject(LocalStorageService);

  load(): void {
    this.localStorageService.setItem(LocalStorageKeysEnum.TASKS, [...TASKS]);
  }

  storeTask$(task: ITaskRequest): Observable<ITaskResponse> {
    const tasks =
      this.localStorageService.getItem<ITaskResponse[]>(
        LocalStorageKeysEnum.TASKS,
      ) ?? [];

    const newTask: ITaskResponse = {
      ...task,
      id: uuidv4(),
      isFinished: false,
    };
    newTask.id = uuidv4();
    tasks.push(newTask);

    this.localStorageService.setItem(LocalStorageKeysEnum.TASKS, tasks);

    return of(newTask).pipe(delay(200));
  }

  updateTask$(updatedTask: ITaskResponse): Observable<ITaskResponse> {
    const tasks =
      this.localStorageService.getItem<ITaskResponse[]>(
        LocalStorageKeysEnum.TASKS,
      ) ?? [];

    const updatedTaskIndex = tasks.findIndex(
      (task) => task.id === updatedTask.id,
    );

    tasks[updatedTaskIndex] = updatedTask;

    this.localStorageService.setItem(LocalStorageKeysEnum.TASKS, tasks);

    return of(updatedTask).pipe(delay(200));
  }

  removeTask$(id: string): Observable<ITaskResponse> {
    const tasks =
      this.localStorageService.getItem<ITaskResponse[]>(
        LocalStorageKeysEnum.TASKS,
      ) ?? [];

    const removeTaskIndex = tasks.findIndex((task) => task.id === id);
    const removedTask = tasks[removeTaskIndex];

    tasks.splice(removeTaskIndex, 1);

    this.localStorageService.setItem(LocalStorageKeysEnum.TASKS, tasks);

    return of(removedTask).pipe(delay(200));
  }
}
