import { Injectable, inject } from '@angular/core';
import { Observable, defer, delay, filter, map, of } from 'rxjs';

import { LocalStorageKeysEnum } from 'src/app/core/data/enums/local-storage-keys.enum';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { v4 as uuidv4 } from 'uuid';
import {
  ITaskListRequest,
  ITaskListResponse,
  ITaskListWithTasksResponse,
  ITaskListsResponse,
  ITaskResponse,
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

  getTaskLists$(title?: string): Observable<ITaskListsResponse> {
    return defer(() => {
      let taskLists =
        this.localStorageService.getItem<ITaskListResponse[]>(
          LocalStorageKeysEnum.TASK_LISTS,
        ) ?? [];
      const tasks =
        this.localStorageService.getItem<ITaskResponse[]>(
          LocalStorageKeysEnum.TASKS,
        ) ?? [];

      if (title) {
        taskLists = taskLists.filter((list) => list.title.includes(title));
      }

      const taskListsWithTasks: ITaskListWithTasksResponse[] = taskLists.map(
        (list) => ({
          ...list,
          tasks: tasks.filter((task) => task.taskListId === list.id),
        }),
      );

      return of({
        taskLists: taskListsWithTasks.filter((list) => !list.isFixed),
        fixed: taskListsWithTasks.filter((list) => list.isFixed),
      });
    }).pipe(delay(2000));
  }

  getTaskList$(id: string): Observable<ITaskListWithTasksResponse> {
    return this.getTaskLists$().pipe(
      map((response) => [...response.taskLists, ...response.fixed]),
      map((taskLists) => taskLists.find((list) => list.id === id)),
      filter((taskList) => !!taskList),
      map(
        (taskList) =>
          ({
            ...taskList,
            tasks: taskList?.tasks?.filter(
              (task) => task.taskListId === taskList.id,
            ),
          }) as ITaskListWithTasksResponse,
      ),
    );
  }

  storeTaskList$(taskList: ITaskListRequest): Observable<ITaskListResponse> {
    return defer(() => {
      const taskLists =
        this.localStorageService.getItem<ITaskListResponse[]>(
          LocalStorageKeysEnum.TASK_LISTS,
        ) ?? [];

      const newTaskList: ITaskListResponse = {
        id: uuidv4(),
        title: taskList.title ?? '',
        isFixed: taskList.isFixed ?? false,
        bgColor: taskList.bgColor,
      };

      taskLists.push(newTaskList);

      this.localStorageService.setItem(
        LocalStorageKeysEnum.TASK_LISTS,
        taskLists,
      );

      return of(newTaskList).pipe(delay(2000));
    });
  }

  updateTaskList$(
    taskList: ITaskListRequest & Required<Pick<ITaskListRequest, 'id'>>,
  ): Observable<ITaskListWithTasksResponse> {
    return defer(() => {
      const taskLists =
        this.localStorageService.getItem<ITaskListResponse[]>(
          LocalStorageKeysEnum.TASK_LISTS,
        ) ?? [];

      const taskListIndex = taskLists.findIndex(
        (list) => list.id === taskList.id,
      );

      // if (taskListIndex === -1) {
      //   return EMPTY;
      // }

      const updatedTaskList: ITaskListResponse = {
        id: taskList.id,
        title: taskList.title ?? 'Sem título',
        isFixed: taskList.isFixed ?? false,
        bgColor: taskList.bgColor,
      };

      taskLists[taskListIndex] = updatedTaskList;

      this.localStorageService.setItem(
        LocalStorageKeysEnum.TASK_LISTS,
        taskLists,
      );

      return this.getTaskList$(updatedTaskList.id);
    });
  }

  removeTaskList$(id: string): Observable<boolean> {
    return defer(() => {
      const taskLists =
        this.localStorageService.getItem<ITaskListResponse[]>(
          LocalStorageKeysEnum.TASK_LISTS,
        ) ?? [];

      const newTaskLists = taskLists.filter((list) => list.id !== id);

      this.localStorageService.setItem(
        LocalStorageKeysEnum.TASK_LISTS,
        newTaskLists,
      );

      return of(true);
    });
  }
}
