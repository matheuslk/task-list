import { Color } from 'src/app/features/task-list/data/types/color.type';

export const getModalClass = (color?: Color): string => {
  const modalClass = 'task-list-modal';
  if (!color) {
    return modalClass;
  }
  return `${modalClass} ${modalClass}--bg-${color}`;
};
