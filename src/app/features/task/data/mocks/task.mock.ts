import { StatusEnum } from '../enums/status.enum';
import { ITaskList } from '../interfaces/task.interface';

export const TASK_LIST: ITaskList[] = [
  {
    title:
      'Lista 111111111111111111111111111111111111111111111111111111111111111',
    tasks: [
      {
        id: 1,
        description: 'Tarefa 1111111111111111111111111111111111',
        status: StatusEnum.TODO,
      },
      {
        id: 1,
        description: 'Tarefa 1111111111111111111111111111111111',
        status: StatusEnum.TODO,
      },

      {
        id: 2,
        description: 'Tarefa 2',
        status: StatusEnum.TODO,
        deadlineDate: '2023-10-31',
      },
      {
        id: 2,
        description: 'Tarefa 2',
        status: StatusEnum.TODO,
        deadlineDate: '2023-10-31',
      },
      {
        id: 3,
        description: 'Tarefa 3',
        status: StatusEnum.TODO,
        repeatAfterDays: 7,
      },
      { id: 4, description: 'Tarefa 4', status: StatusEnum.TODO },
    ],
  },
  {
    title: 'Lista 2',
    tasks: [
      { id: 5, description: 'Tarefa 5', status: StatusEnum.TODO },
      {
        id: 6,
        description: 'Tarefa 6',
        status: StatusEnum.TODO,
        deadlineDate: '2023-11-15',
      },
      {
        id: 7,
        description: 'Tarefa 7',
        status: StatusEnum.TODO,
        repeatAfterDays: 14,
      },
      { id: 8, description: 'Tarefa 8', status: StatusEnum.TODO },
    ],
  },
  {
    title: 'Lista 3',
    tasks: [
      {
        id: 9,
        description: 'Tarefa 9',
        status: StatusEnum.TODO,
        deadlineDate: '2023-12-01',
      },
      {
        id: 10,
        description: 'Tarefa 10',
        status: StatusEnum.TODO,
        repeatAfterDays: 30,
      },
      { id: 11, description: 'Tarefa 11', status: StatusEnum.TODO },
      { id: 12, description: 'Tarefa 12', status: StatusEnum.TODO },
    ],
  },
  {
    title: 'Lista 4',
    tasks: [
      { id: 13, description: 'Tarefa 13', status: StatusEnum.TODO },
      {
        id: 14,
        description: 'Tarefa 14',
        status: StatusEnum.TODO,
        deadlineDate: '2023-12-15',
      },
      {
        id: 15,
        description: 'Tarefa 15',
        status: StatusEnum.TODO,
        repeatAfterDays: 20,
      },
      { id: 16, description: 'Tarefa 16', status: StatusEnum.TODO },
    ],
  },
  {
    title: 'Lista 5',
    tasks: [
      {
        id: 17,
        description: 'Tarefa 17',
        status: StatusEnum.TODO,
        deadlineDate: '2023-12-31',
      },
      {
        id: 18,
        description: 'Tarefa 18',
        status: StatusEnum.TODO,
        repeatAfterDays: 10,
      },
      { id: 19, description: 'Tarefa 19', status: StatusEnum.TODO },
      { id: 20, description: 'Tarefa 20', status: StatusEnum.TODO },
    ],
  },
];
