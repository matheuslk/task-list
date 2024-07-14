import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { GetBgColorClassPipe } from '../../../pipes/get-bg-color-class.pipe';
import { TaskListStateEffectsService } from '../../../state/task-list/task-list.state.effects.service';
import { TaskListStateStoreService } from '../../../state/task-list/task-list.state.store.service';
import { Subject, skip, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskListModalHeaderComponent } from './components/task-list-modal-header/task-list-modal-header.component';
import { TaskListModalFooterComponent } from './components/task-list-modal-footer/task-list-modal-footer.component';
import { TaskListModalStateEffectsService } from './state/task-list-modal.state.effects.service';
import { TaskListModalStateStoreService } from './state/task-list-modal.state.store.service';

const modules = [NzCardModule];
const components = [TaskListModalHeaderComponent, TaskListModalFooterComponent];
const pipes = [GetBgColorClassPipe];

@Component({
  selector: 'app-task-list-store-card',
  standalone: true,
  imports: [CommonModule, ...modules, ...components, ...pipes],
  providers: [
    TaskListModalStateStoreService,
    TaskListModalStateEffectsService,
    TaskListStateStoreService,
    TaskListStateEffectsService,
  ],
  templateUrl: './task-list-modal.component.html',
  styleUrls: ['./task-list-modal.component.less'],
})
export class TaskListModalComponent {
  private taskListModalStateEffectsService = inject(
    TaskListModalStateEffectsService,
  );
  private taskListStateStoreService = inject(TaskListStateStoreService);
  private elementRef = inject(ElementRef);

  private outsideClick$: Subject<void> = new Subject();
  private outsideClickListener$ = this.outsideClick$.pipe(
    skip(1),
    tap(() => {
      this.taskListModalStateEffectsService.close();
    }),
    takeUntilDestroyed(),
  );

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent): void {
    const insideClick = (
      this.elementRef.nativeElement as HTMLDivElement
    ).contains(event.target as HTMLElement);
    if (insideClick) {
      return;
    }
    this.outsideClick$.next();
  }

  taskList$ = this.taskListStateStoreService.selectTaskList$();

  ngOnInit(): void {
    this.outsideClickListener$.subscribe();
  }
}
