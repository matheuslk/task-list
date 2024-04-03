import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { TaskListsActionsComponent } from './components/task-list-actions/task-lists-actions.component';
import { TaskListsComponent } from './components/task-lists/task-lists.component';
import { HomeEffectsService } from './state/home/home.effects.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzGridModule,
    NzTypographyModule,
    TaskListsActionsComponent,
    TaskListsComponent,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.less'],
})
export class HomePage implements OnInit {
  homeEffectsService = inject(HomeEffectsService);

  ngOnInit(): void {
    this.homeEffectsService.getTaskLists();
  }
}
