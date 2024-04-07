import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '../data/types/color.type';
import { ColorEnum } from '../data/enums/color.enum';

@Pipe({
  name: 'getBorderColorClass',
  standalone: true,
})
export class GetBorderColorClassPipe implements PipeTransform {
  transform(value?: Color): string {
    if (!value) {
      return '';
    }

    const colorName =
      Object.keys(ColorEnum)[
        Object.values(ColorEnum).indexOf(value)
      ].toLowerCase();

    return `border-${colorName}`;
  }
}
