import { Color } from '../types/color.type';

export interface ITaskListResponse {
  taskLists: ITaskList[];
  fixed: ITaskList[];
}

export interface ITaskList {
  id?: string;
  title: string;
  tasks: ITask[];
  isFixed: boolean;
  bgColor?: Color;
}

export interface ITask {
  id?: string;
  description: string;
  isFinished: boolean;
  task_id: string;
}
