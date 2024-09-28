import { Pipe, PipeTransform } from '@angular/core';
import { ColorValueEnum } from '../data/enums/color.enum';
import { Color, ColorValue } from '../data/types/color.type';

@Pipe({
  name: 'getColorValue',
  standalone: true,
})
export class GetColorValuePipe implements PipeTransform {
  transform(value: Color): ColorValue {
    return ColorValueEnum[value];
  }
}
