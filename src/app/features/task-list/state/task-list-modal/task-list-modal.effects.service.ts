import { Injectable, inject } from '@angular/core';
import { TaskListService } from '../../services/task-list.service';
import { TaskListModalStoreService } from './task-list-modal.store.service';

@Injectable({
  providedIn: 'root',
})
export class TaskListModalEffectsService {
  constructor() {
    //this.getList$.subscribe();
  }

  private taskListModalStoreService = inject(TaskListModalStoreService);
  private taskListService = inject(TaskListService);

  // private getTaskList$: Subject<string> = new Subject<void>();
  // private getList$ = this.getTaskList$.pipe(
  //   switchMap(() => this.homeStoreService.selectTaskLists$()),
  //   take(1),
  //   tap((taskLists) => {
  //     this.homeStoreService.setTaskLists({
  //       ...taskLists,
  //       isLoading: true,
  //       error: undefined,
  //     });
  //   }),
  //   switchMap(() => this.taskListService.getTaskLists$()),
  //   tap((taskLists) => {
  //     console.log('getList$', taskLists);
  //     this.homeStoreService.setTaskLists({
  //       data: taskLists,
  //       isLoading: false,
  //     });
  //   }),
  //   catchError((error) => {
  //     this.homeStoreService.setTaskLists({
  //       data: undefined,
  //       isLoading: false,
  //       error,
  //     });
  //     return EMPTY;
  //   }),
  //   takeUntil(this.homeStoreService.selectViewDestroyed$()),
  // );

  // getTaskList(): void {
  //   this.getTaskLists$.next();
  // }
}
