import { TaskListColor } from '../types/task-list-color.type';

export interface ITaskList {
  id?: string;
  title: string;
  tasks?: ITask[];
  bgColor?: TaskListColor;
}

export interface ITask {
  id?: string;
  description: string;
  isFinished: boolean;
  task_id: string;
  deadlineDate?: string;
  repeatAfterDays?: number;
}
