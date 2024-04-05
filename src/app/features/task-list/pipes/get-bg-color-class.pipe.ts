import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '../data/types/color.type';
import { ColorEnum } from '../data/enums/color.enum';

@Pipe({
  name: 'getBgColorClass',
  standalone: true,
})
export class GetBgColorClassPipe implements PipeTransform {
  transform(value?: Color): string {
    if (!value) {
      return '';
    }

    const colorName =
      Object.keys(ColorEnum)[
        Object.values(ColorEnum).indexOf(value)
      ].toLowerCase();

    return `bg-${colorName}`;
  }
}
