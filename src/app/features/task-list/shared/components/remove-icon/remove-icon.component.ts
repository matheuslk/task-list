import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

const modules = [NzIconModule];

@Component({
  selector: 'app-remove-icon',
  standalone: true,
  imports: [CommonModule, ...modules],
  template: `<span
    class="remove-icon icon"
    nz-icon
    nzType="delete"
    nzTheme="outline"
  ></span>`,
  styleUrls: ['./remove-icon.component.less'],
})
export class RemoveIconComponent {}
