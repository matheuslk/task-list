import { Injectable } from '@angular/core';
import { ITaskList } from '../interfaces/task.interface';
import { Observable, of } from 'rxjs';
import { TASK_LIST } from '../mocks/task.mock';

@Injectable()
export class TaskService {
  getTasks$(): Observable<ITaskList[]> {
    return of(TASK_LIST);
  }
}
