import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePage } from './features/home/home.page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomePage, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'task-list';
}
