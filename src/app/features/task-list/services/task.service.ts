import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';

import { LocalStorageKeysEnum } from 'src/app/shared/data/enums/local-storage-keys.enum';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { v4 as uuidv4 } from 'uuid';
import { ITask } from '../data/interfaces/task.interface';
import { TASKS } from '../data/mocks/task.mock';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  localStorageService = inject(LocalStorageService);

  load(): void {
    this.localStorageService.setItem(LocalStorageKeysEnum.TASKS, [...TASKS]);
  }

  storeTask$(storeTask: ITask): Observable<never> {
    const tasks = this.localStorageService.getItem<ITask[]>(
      LocalStorageKeysEnum.TASKS,
    );

    if (!tasks) {
      return EMPTY;
    }

    storeTask.id = uuidv4();
    tasks.push(storeTask);

    this.localStorageService.setItem(LocalStorageKeysEnum.TASKS, tasks);

    return EMPTY;
  }

  updateTask$(updatedTask: ITask): Observable<never> {
    const tasks = this.localStorageService.getItem<ITask[]>(
      LocalStorageKeysEnum.TASKS,
    );

    if (!tasks) {
      return EMPTY;
    }

    const updatedTaskIndex = tasks.findIndex(
      (task) => task.id === updatedTask.id,
    );

    if (updatedTaskIndex === -1) {
      return EMPTY;
    }

    tasks[updatedTaskIndex] = updatedTask;

    this.localStorageService.setItem(LocalStorageKeysEnum.TASKS, tasks);

    return EMPTY;
  }

  removeTask$(id: string): Observable<never> {
    const tasks = this.localStorageService.getItem<ITask[]>(
      LocalStorageKeysEnum.TASKS,
    );

    if (!tasks) {
      return EMPTY;
    }

    const removeTaskIndex = tasks.findIndex((task) => task.id === id);

    if (removeTaskIndex === -1) {
      return EMPTY;
    }

    tasks.splice(removeTaskIndex, 1);

    this.localStorageService.setItem(LocalStorageKeysEnum.TASKS, tasks);

    return EMPTY;
  }
}
