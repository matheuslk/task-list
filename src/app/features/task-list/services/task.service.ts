import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { LocalStorageKeysEnum } from 'src/app/core/data/enums/local-storage-keys.enum';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { v4 as uuidv4 } from 'uuid';
import { ITask } from '../data/interfaces/task-list.interface';
import { TASKS } from '../data/mocks/task.mock';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  localStorageService = inject(LocalStorageService);

  load(): void {
    this.localStorageService.setItem(LocalStorageKeysEnum.TASKS, [...TASKS]);
  }

  storeTask$(storeTask: ITask): Observable<ITask> {
    const tasks =
      this.localStorageService.getItem<ITask[]>(LocalStorageKeysEnum.TASKS) ??
      [];

    storeTask.id = uuidv4();
    tasks.push(storeTask);

    this.localStorageService.setItem(LocalStorageKeysEnum.TASKS, tasks);

    return of(storeTask);
  }

  updateTask$(updatedTask: ITask): Observable<ITask> {
    const tasks =
      this.localStorageService.getItem<ITask[]>(LocalStorageKeysEnum.TASKS) ??
      [];

    const updatedTaskIndex = tasks.findIndex(
      (task) => task.id === updatedTask.id,
    );

    // if (updatedTaskIndex === -1) {
    //   return EMPTY;
    // }

    tasks[updatedTaskIndex] = updatedTask;

    this.localStorageService.setItem(LocalStorageKeysEnum.TASKS, tasks);

    return of(updatedTask);
  }

  removeTask$(id: string): Observable<ITask> {
    const tasks =
      this.localStorageService.getItem<ITask[]>(LocalStorageKeysEnum.TASKS) ??
      [];

    const removeTaskIndex = tasks.findIndex((task) => task.id === id);
    const removedTask = tasks[removeTaskIndex];

    // if (removeTaskIndex === -1) {
    //   return EMPTY;
    // }

    tasks.splice(removeTaskIndex, 1);

    this.localStorageService.setItem(LocalStorageKeysEnum.TASKS, tasks);

    return of(removedTask);
  }
}
