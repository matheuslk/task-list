import { Injectable, inject } from '@angular/core';
import { Observable, filter, map, of } from 'rxjs';

import { LocalStorageKeysEnum } from 'src/app/shared/data/enums/local-storage-keys.enum';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { v4 as uuidv4 } from 'uuid';
import {
  ITask,
  ITaskList,
  ITaskListResponse,
} from '../data/interfaces/task-list.interface';
import { TASK_LISTS } from '../data/mocks/task-list.mock';

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

  getTaskLists$(body?: { title: string }): Observable<ITaskListResponse> {
    let taskLists =
      this.localStorageService.getItem<ITaskList[]>(
        LocalStorageKeysEnum.TASK_LISTS,
      ) ?? [];
    const tasks =
      this.localStorageService.getItem<ITask[]>(LocalStorageKeysEnum.TASKS) ??
      [];

    if (body?.title) {
      taskLists = taskLists.filter((list) => list.title.includes(body.title));
    }

    taskLists = taskLists.map((list) => {
      return {
        ...list,
        tasks: tasks?.filter((task) => task.task_id === list.id),
      };
    });

    return of({
      taskLists: taskLists.filter((list) => !list.isFixed),
      fixed: taskLists.filter((list) => list.isFixed),
    });
  }

  getTaskList$(id: string): Observable<ITaskList> {
    return this.getTaskLists$().pipe(
      map((response) => [...response.taskLists, ...response.fixed]),
      map((taskLists) => taskLists.find((list) => list.id === id)),
      filter((taskList) => !!taskList),
      map((taskList) => {
        return {
          ...taskList,
          tasks: taskList?.tasks?.filter(
            (task) => task.task_id === taskList.id,
          ),
        } as ITaskList;
      }),
    );
  }

  storeTaskList$(storeTaskList: ITaskList): Observable<ITaskList> {
    const taskLists =
      this.localStorageService.getItem<ITaskList[]>(
        LocalStorageKeysEnum.TASK_LISTS,
      ) ?? [];

    storeTaskList.id = uuidv4();
    taskLists.push(storeTaskList);

    this.localStorageService.setItem(
      LocalStorageKeysEnum.TASK_LISTS,
      taskLists,
    );

    return of(storeTaskList);
  }

  updateTaskList$(updatedTaskList: ITaskList): Observable<ITaskList> {
    const taskLists =
      this.localStorageService.getItem<ITaskList[]>(
        LocalStorageKeysEnum.TASK_LISTS,
      ) ?? [];

    const updatedTaskListIndex = taskLists.findIndex(
      (list) => list.id === updatedTaskList.id,
    );

    // if (updatedTaskListIndex === -1) {
    //   return EMPTY;
    // }

    taskLists[updatedTaskListIndex] = updatedTaskList;

    this.localStorageService.setItem(
      LocalStorageKeysEnum.TASK_LISTS,
      taskLists,
    );

    return of(updatedTaskList);
  }
}
