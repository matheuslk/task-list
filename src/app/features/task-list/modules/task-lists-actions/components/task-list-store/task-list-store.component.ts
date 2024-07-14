import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { TaskListStoreStateEffectsService } from '../../state/task-list-store/task-list-store.state.effects.service';
import { TaskListsActionsStateStoreService } from '../../state/task-lists-actions/task-lists-actions.state.store.service';

const modules = [FormsModule, NzInputModule, NzButtonModule, NzIconModule];

@Component({
  selector: 'app-task-list-store',
  standalone: true,
  imports: [CommonModule, ...modules],
  providers: [TaskListStoreStateEffectsService],
  templateUrl: './task-list-store.component.html',
  styleUrls: ['./task-list-store.component.less'],
})
export class TaskListStoreComponent implements AfterViewInit {
  private taskListStoreStateEffectsService = inject(
    TaskListStoreStateEffectsService,
  );
  private taskListsActionsStateStoreService = inject(
    TaskListsActionsStateStoreService,
  );

  @ViewChild('titleInput') titleInput: ElementRef<HTMLInputElement>;
  @ViewChild('actions') actions: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.titleInput.nativeElement.focus();
  }

  handleBlur(event: FocusEvent): void {
    const clickInActions = this.actions.nativeElement.contains(
      event.relatedTarget as HTMLElement,
    );

    if (clickInActions) {
      return;
    }

    this.handleAddTaskList();
  }

  handleAddTaskList(): void {
    const title = this.titleInput.nativeElement.value;
    if (!title) {
      this.handleClose();
      return;
    }
    this.taskListStoreStateEffectsService.storeTaskList({ title });
  }

  handleClose(): void {
    this.taskListsActionsStateStoreService.setIsStoringTaskList(false);
  }
}
