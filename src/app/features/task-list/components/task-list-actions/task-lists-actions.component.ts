import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { combineLatest, map } from 'rxjs';
import { HomeStoreService } from '../../state/home/home.store.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-task-lists-actions',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule, SearchComponent],
  templateUrl: './task-lists-actions.component.html',
  styleUrls: ['./task-lists-actions.component.less'],
})
export class TaskListsActionsComponent {
  homeStoreService = inject(HomeStoreService);

  private isInitialLoading$ = this.homeStoreService.selectIsInitialLoading$();
  private isUpdatingList$ = this.homeStoreService.selectIsUpdatingList$();

  disableActions$ = combineLatest([
    this.isInitialLoading$,
    this.isUpdatingList$,
  ]).pipe(
    map(
      ([isInitialLoading, isUpdatingList]) =>
        isInitialLoading || isUpdatingList,
    ),
  );
}
