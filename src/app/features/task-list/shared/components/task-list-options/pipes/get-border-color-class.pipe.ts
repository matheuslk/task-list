import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '../../../data/types/color.type';

@Pipe({
  name: 'getBorderColorClass',
  standalone: true,
})
export class GetBorderColorClassPipe implements PipeTransform {
  transform(value?: Color): string {
    if (!value) {
      return '';
    }
    return `border-${value}`;
  }
}
