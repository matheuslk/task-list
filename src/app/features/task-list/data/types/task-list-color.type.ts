import { TaskListColorEnum } from '../enums/task-list-color.enum';

export type TaskListColor =
  | TaskListColorEnum.BLUE
  | TaskListColorEnum.YELLOW
  | TaskListColorEnum.RED;
