import { Color } from '../types/color.type';
import { ITaskResponse } from './task.interface';

// REQUEST INTERFACES

export interface ITaskListRequest {
  title: string;
}

// RESPONSE INTERFACES
export interface ITaskListsResponse {
  taskLists: ITaskListWithTasksResponse[];
  fixed: ITaskListWithTasksResponse[];
}

export interface ITaskListResponse extends ITaskListRequest {
  id: string;
  isFixed: boolean;
  bgColor?: Color;
}

export interface ITaskListWithTasksResponse extends ITaskListResponse {
  tasks: ITaskResponse[];
}
