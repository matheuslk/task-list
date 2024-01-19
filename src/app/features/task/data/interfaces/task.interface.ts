import { Status } from '../types/status.type';

export interface ITaskList {
  title: string;
  tasks: ITask[];
}

export interface ITask {
  id: number;
  description: string;
  status: Status;
  deadlineDate?: string;
  repeatAfterDays?: number;
}
