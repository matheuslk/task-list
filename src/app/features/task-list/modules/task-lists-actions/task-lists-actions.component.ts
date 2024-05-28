import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HomeStateStoreService } from '../../state/home/home.state.store.service';
import { TaskListStoreCardComponent } from '../card/task-list-store-card/task-list-store-card.component';
import { SearchComponent } from './components/search/search.component';

const modules = [NzButtonModule, NzIconModule];
const components = [SearchComponent, TaskListStoreCardComponent];

@Component({
  selector: 'app-task-lists-actions',
  standalone: true,
  imports: [CommonModule, ...modules, ...components],
  templateUrl: './task-lists-actions.component.html',
  styleUrls: ['./task-lists-actions.component.less'],
})
export class TaskListsActionsComponent {
  homeStateStoreService = inject(HomeStateStoreService);

  isInitialLoading$ = this.homeStateStoreService.selectIsInitialLoading$();
}
