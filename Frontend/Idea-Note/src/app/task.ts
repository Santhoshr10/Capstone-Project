import { TaskStatus } from "./task-status.enum";

export class Task {
  taskName: string;
  dueDate: Date ;
  taskDescription: string;
  isArchived: boolean;
  taskPriority: string;
  taskId: string;
  trashed: boolean;
  taskStatus: TaskStatus | null;

  constructor(
    taskName: string,
    dueDate: Date ,
    taskPriority: string,
    taskDescription: string,
    isArchived: boolean,
    taskId: string,
    trashed: boolean,
    taskStatus: TaskStatus | null = null
  ) {
    this.taskName = taskName;
    this.dueDate = dueDate;
    this.taskDescription = taskDescription;
    this.isArchived = isArchived;
    this.taskPriority = taskPriority;
    this.taskId = taskId;
    this.trashed = trashed;
    this.taskStatus = taskStatus;
  }
}

