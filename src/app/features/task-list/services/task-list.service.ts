import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';

import { LocalStorageKeysEnum } from 'src/app/shared/data/enums/local-storage-keys.enum';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ITask, ITaskList } from '../data/interfaces/task.interface';
import { TASK_LISTS } from '../data/mocks/task-list.mock';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class TaskListService {
  localStorageService = inject(LocalStorageService);

  load(): void {
    this.localStorageService.setItem(LocalStorageKeysEnum.TASK_LISTS, [
      ...TASK_LISTS,
    ]);
  }

  getTaskLists$(): Observable<ITaskList[]> {
    const taskLists = this.localStorageService.getItem<ITaskList[]>(
      LocalStorageKeysEnum.TASK_LISTS,
    );
    const tasks = this.localStorageService.getItem<ITask[]>(
      LocalStorageKeysEnum.TASKS,
    );
    if (!taskLists) {
      return EMPTY;
    }

    return of(
      taskLists.map((list) => {
        return {
          ...list,
          tasks: tasks?.filter((task) => task.task_id === list.id),
        };
      }),
    );
  }

  getTaskList$(id: string): Observable<ITaskList> {
    const taskLists = this.localStorageService.getItem<ITaskList[]>(
      LocalStorageKeysEnum.TASK_LISTS,
    );
    const tasks = this.localStorageService.getItem<ITask[]>(
      LocalStorageKeysEnum.TASKS,
    );

    if (!taskLists) {
      return EMPTY;
    }

    const taskList = taskLists.find((list) => list.id === id);

    if (!taskList) {
      return EMPTY;
    }

    return of({
      ...taskList,
      tasks: tasks?.filter((task) => task.task_id === taskList.id),
    });
  }

  storeTaskList$(storeTaskList: ITaskList): Observable<never> {
    const taskLists = this.localStorageService.getItem<ITaskList[]>(
      LocalStorageKeysEnum.TASK_LISTS,
    );

    if (!taskLists) {
      return EMPTY;
    }

    storeTaskList.id = uuidv4();
    taskLists.push(storeTaskList);

    this.localStorageService.setItem(
      LocalStorageKeysEnum.TASK_LISTS,
      taskLists,
    );

    return EMPTY;
  }

  updateTaskList$(updatedTaskList: ITaskList): Observable<never> {
    const taskLists = this.localStorageService.getItem<ITaskList[]>(
      LocalStorageKeysEnum.TASK_LISTS,
    );

    if (!taskLists) {
      return EMPTY;
    }

    const updatedTaskListIndex = taskLists.findIndex(
      (list) => list.id === updatedTaskList.id,
    );

    if (updatedTaskListIndex === -1) {
      return EMPTY;
    }

    taskLists[updatedTaskListIndex] = updatedTaskList;

    this.localStorageService.setItem(
      LocalStorageKeysEnum.TASK_LISTS,
      taskLists,
    );

    return EMPTY;
  }
}
