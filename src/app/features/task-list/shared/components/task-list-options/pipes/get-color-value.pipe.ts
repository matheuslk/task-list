import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '../../../data/types/color.type';
import { ColorValueEnum } from '../data/enums/color-value.enum';
import { ColorValue } from '../data/types/color-value.type';

@Pipe({
  name: 'getColorValue',
  standalone: true,
})
export class GetColorValuePipe implements PipeTransform {
  transform(value: Color): ColorValue {
    return ColorValueEnum[value];
  }
}
