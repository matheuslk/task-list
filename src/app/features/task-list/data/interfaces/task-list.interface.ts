import { Color } from '../types/color.type';

// REQUEST INTERFACES

export interface ITaskListRequest {
  id?: string;
  title?: string;
  isFixed?: boolean;
  bgColor?: Color;
}

export interface ITaskRequest {
  id?: string;
  description: string;
  isFinished?: boolean;
}

// RESPONSE INTERFACES
export interface ITaskListsResponse {
  taskLists: ITaskListWithTasksResponse[];
  fixed: ITaskListWithTasksResponse[];
}

export interface ITaskListResponse
  extends Pick<ITaskListRequest, 'bgColor'>,
    Required<Omit<ITaskListRequest, 'bgColor'>> {}

export interface ITaskListWithTasksResponse extends ITaskListResponse {
  tasks: ITaskResponse[];
}

export interface ITaskResponse
  extends Pick<ITaskRequest, 'description'>,
    Required<Omit<ITaskRequest, 'description'>> {
  taskListId: string;
}
