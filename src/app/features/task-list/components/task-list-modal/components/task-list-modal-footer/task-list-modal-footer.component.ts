import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { RemoveTaskListComponent } from 'src/app/features/task-list/shared/components/remove-task-list/remove-task-list.component';

const modules = [NzIconModule, NzButtonModule];
const components = [RemoveTaskListComponent];

@Component({
  selector: 'app-task-list-modal-footer',
  standalone: true,
  imports: [CommonModule, ...modules, ...components],
  templateUrl: './task-list-modal-footer.component.html',
  styleUrls: ['./task-list-modal-footer.component.less'],
})
export class TaskListModalFooterComponent {
  private modalRef = inject(NzModalRef);

  handleClose(): void {
    this.modalRef.close();
  }
}
