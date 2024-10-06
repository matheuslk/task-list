import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { debounceTime, distinctUntilChanged, skip, tap } from 'rxjs';
import { HomeStateService } from 'src/app/features/task-list/state/home/home.state.service';
import { HomeEffectsService } from '../../../../state/home/home.effects.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, NzInputModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less'],
})
export class SearchComponent implements OnInit {
  private homeStateService = inject(HomeStateService);
  private homeEffectsService = inject(HomeEffectsService);

  @Input() disabled = false;

  search$ = this.homeStateService.selectSearch$();
  private searchListener$ = this.search$.pipe(
    skip(1),
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => {
      this.homeEffectsService.getTaskLists();
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
    this.homeStateService.setSearch(search);
  }
}
