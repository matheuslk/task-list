import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { debounceTime, distinctUntilChanged, skip, tap } from 'rxjs';
import { HomeStateStoreService } from 'src/app/features/task-list/state/home/home.state.store.service';
import { HomeStateEffectsService } from '../../../../state/home/home.state.effects.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, NzInputModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less'],
})
export class SearchComponent implements OnInit {
  private homeStateStoreService = inject(HomeStateStoreService);
  private homeStateEffectsService = inject(HomeStateEffectsService);

  @Input() disabled = false;

  search$ = this.homeStateStoreService.selectSearch$();
  private searchListener$ = this.search$.pipe(
    skip(1),
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => {
      this.homeStateEffectsService.getTaskLists();
    }),
    takeUntilDestroyed(),
  );

  ngOnInit(): void {
    this.setListeners();
  }

  private setListeners(): void {
    this.searchListener$.subscribe();
  }

  handleSearch(search: string): void {
    this.homeStateStoreService.setSearch(search);
  }
}
