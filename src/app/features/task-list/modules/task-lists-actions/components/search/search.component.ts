import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  skip,
  tap,
} from 'rxjs';
import { HomeStateEffectsService } from '../../../../state/home/home.state.effects.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, NzInputModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less'],
})
export class SearchComponent implements OnInit {
  private homeStateEffectsService = inject(HomeStateEffectsService);

  @Input() disabled = false;

  search$ = new BehaviorSubject('');
  private searchListener$ = this.search$.asObservable().pipe(
    skip(1),
    debounceTime(300),
    distinctUntilChanged(),
    tap((search) => {
      this.homeStateEffectsService.getTaskLists(search);
    }),
    takeUntilDestroyed(),
  );

  ngOnInit(): void {
    this.setListeners();
  }

  private setListeners(): void {
    this.searchListener$.subscribe();
  }
}
