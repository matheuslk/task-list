import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-spin-overlay',
  standalone: true,
  imports: [CommonModule, NzSpinModule],
  templateUrl: './spin-overlay.component.html',
  styleUrls: ['./spin-overlay.component.less'],
})
export class SpinOverlayComponent {
  @Input() position: 'absolute' | 'fixed' = 'fixed';
}
