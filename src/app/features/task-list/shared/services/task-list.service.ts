import { inject, Injectable } from '@angular/core';
import {
  defer,
  delay,
  exhaustMap,
  filter,
  forkJoin,
  map,
  Observable,
  of,
  tap,
} from 'rxjs';

import { LocalStorageKeysEnum } from 'src/app/core/data/enums/local-storage-keys.enum';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { v4 as uuidv4 } from 'uuid';
import {
  ITaskListRequest,
  ITaskListResponse,
  ITaskListsResponse,
  ITaskListWithTasksResponse,
} from '../data/interfaces/task-list.interface';
import { TASK_LISTS } from '../data/mocks/task-list.mock';
import { ITaskResponse } from '../data/interfaces/task.interface';
import { TaskService } from '../../components/task-list-modal/services/task.service';

@Injectable({
  providedIn: 'root',
})
export class TaskListService {
  private taskService = inject(TaskService);
  private localStorageService = inject(LocalStorageService);

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
      }).pipe(delay(1000));
    });
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
      delay(1000),
    );
  }

  storeTaskList$(
    taskList: ITaskListRequest,
  ): Observable<ITaskListWithTasksResponse> {
    return defer(() => {
      const taskLists =
        this.localStorageService.getItem<ITaskListResponse[]>(
          LocalStorageKeysEnum.TASK_LISTS,
        ) ?? [];

      const newTaskList: ITaskListResponse = {
        id: uuidv4(),
        title: taskList.title ?? '',
        isFixed: false,
      };

      taskLists.push(newTaskList);

      this.localStorageService.setItem(
        LocalStorageKeysEnum.TASK_LISTS,
        taskLists,
      );

      return of({ ...newTaskList, tasks: [] });
    });
  }

  updateTaskList$(
    taskList: ITaskListResponse,
  ): Observable<ITaskListWithTasksResponse> {
    return defer(() => {
      const taskLists =
        this.localStorageService.getItem<ITaskListResponse[]>(
          LocalStorageKeysEnum.TASK_LISTS,
        ) ?? [];

      const taskListIndex = taskLists.findIndex(
        (list) => list.id === taskList.id,
      );

      taskLists[taskListIndex] = taskList;

      this.localStorageService.setItem(
        LocalStorageKeysEnum.TASK_LISTS,
        taskLists,
      );

      return this.getTaskList$(taskList.id);
    });
  }

  removeTaskList$(id: string): Observable<ITaskListResponse> {
    return defer(() => this.getTaskList$(id)).pipe(
      map((taskList) =>
        taskList.tasks.map((task) => this.taskService.removeTask$(task.id)),
      ),
      tap((deleteTaskSources$) => {
        console.log('ANTES DO EXHAUSTMAP', deleteTaskSources$);
      }),
      exhaustMap((deleteTaskSources$) =>
        deleteTaskSources$.length ? forkJoin(deleteTaskSources$) : of(null),
      ),
      map(() => {
        console.log('removeTaskList$');
        const taskLists =
          this.localStorageService.getItem<ITaskListResponse[]>(
            LocalStorageKeysEnum.TASK_LISTS,
          ) ?? [];

        const removedTaskListIndex = taskLists.findIndex(
          (taskList) => taskList.id === id,
        );
        const removedTaskList = taskLists[removedTaskListIndex];

        taskLists.splice(removedTaskListIndex, 1);

        this.localStorageService.setItem(
          LocalStorageKeysEnum.TASK_LISTS,
          taskLists,
        );

        return removedTaskList;
      }),
    );
  }
}
