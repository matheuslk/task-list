import { ColorEnum, ColorValueEnum } from '../enums/color.enum';

export type Color = ColorEnum.blue | ColorEnum.yellow | ColorEnum.red;
export type ColorValue =
  | ColorValueEnum.blue
  | ColorValueEnum.yellow
  | ColorValueEnum.red;
