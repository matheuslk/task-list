// REQUEST INTERFACES

export interface ITaskRequest {
  description: string;
  taskListId: string;
  isFinished: boolean;
}

// RESPONSE INTERFACES

export interface ITaskResponse extends ITaskRequest {
  id: string;
}
