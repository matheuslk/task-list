import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '../data/types/color.type';

@Pipe({
  name: 'getBgColorClass',
  standalone: true,
})
export class GetBgColorClassPipe implements PipeTransform {
  transform(value?: Color): string {
    if (!value) {
      return '';
    }

    return `bg-${value}`;
  }
}
