import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzGridModule,
    NzCardModule,
    NzButtonModule,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.less'],
})
export class HomePage {}
