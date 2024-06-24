import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TaskDetailsDialogComponent } from '../task-details-dialog/task-details-dialog.component';
import { TaskStatusDialogComponent } from '../task-status-dialog/task-status-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchService } from '../search.service';
import { TaskStatus } from '../task-status.enum';
import { Output, EventEmitter } from '@angular/core';
import { TaskPriorityDialogComponent } from '../task-priority-dialog/task-priority-dialog.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  pendingTasks: Task[] = [];
  completedTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  selectedTask: Task | null = null;
  isEditMode: boolean = false;
  searchQuery: string = '';
  showAllTasks: boolean = false;
  showCompletedTasks: boolean = true;
  showPendingTasks: boolean = true;
  showInProgressTasks: boolean = true;
  
  completedCount: number = 0;
  pendingCount: number = 0;
  inProgressCount: number = 0;
  @Output() taskEdit: EventEmitter<Task> = new EventEmitter<Task>();

  constructor(private taskService: TaskService, private dialog: MatDialog, private snackBar: MatSnackBar, private searchService: SearchService, private cdr: ChangeDetectorRef) { 
    this.searchService.getSearchQuery().subscribe(query => {
      this.searchQuery = query;
      this.loadAllTasks();
    });
  }

  ngOnInit(): void {
    this.loadAllTasks();
  }

  loadAllTasks(): void {
  console.log('Search Query:', this.searchQuery); 
  this.taskService.getAllTasks().subscribe(
    tasks => {
      if (tasks) {
        this.tasks = tasks.filter(task =>
          (!task.trashed && !task.isArchived) && 
          (!this.searchQuery || task.taskName.toLowerCase().includes(this.searchQuery.toLowerCase()))
        );
        console.log('Filtered Tasks:', this.tasks); 
        this.sortTasksByPriority(this.tasks); 
        this.updateTaskCounts();
        
      } else {
        this.resetTaskLists();
      }
    },
    error => {
      console.error('Error loading tasks:', error);
      this.resetTaskLists();
    }
  );
}

  private resetTaskLists(): void {
    this.tasks = [];
    this.completedTasks = [];
    this.pendingTasks = [];
    this.inProgressTasks = [];
    this.completedCount = 0;
    this.pendingCount = 0;
    this.inProgressCount = 0;
  }

  private updateTaskCounts(): void {
    this.completedTasks = this.tasks.filter(task => task.taskStatus === TaskStatus.COMPLETED);
    this.pendingTasks = this.tasks.filter(task => task.taskStatus === TaskStatus.PENDING);
    this.inProgressTasks = this.tasks.filter(task => task.taskStatus === TaskStatus.IN_PROGRESS);
  
    this.completedCount = this.completedTasks.length;
    this.pendingCount = this.pendingTasks.length;
    this.inProgressCount = this.inProgressTasks.length;
  
    this.sortTasksByPriority(this.completedTasks);
  }
  
  addTask(taskName: string, taskDescription: string, taskPriority: string, dueDate: Date): void {
    const newTask = new Task(taskName, dueDate, taskPriority, taskDescription, false, '', false);
    this.taskService.addTask(newTask).subscribe(
        task => {
            this.tasks.push(task);
            this.snackBar.open('Task added successfully.', 'Close', { duration: 2000 });
            this.sortTasksByPriority(this.tasks);
            this.loadAllTasks();
        },
        error => {
            console.error('Error adding task:', error);
            this.snackBar.open('Error adding task. Please try again later.', 'Close', { duration: 2000 });
        }
    );
}

  editTask(task: Task): void {
    console.log('Editing task:', task); 
    this.selectedTask = task;
    this.isEditMode = true;
  }

  updateTask(): void {
    if (this.selectedTask) {
      console.log('Updating task:', this.selectedTask); 
      this.selectedTask.taskName = this.selectedTask.taskName;
      this.selectedTask.dueDate = new Date(this.selectedTask.dueDate);
      this.selectedTask.taskDescription = this.selectedTask.taskDescription;
  
      this.taskService.updateTask(this.selectedTask).subscribe(
        (updatedTask: Task) => {
          console.log('Updated Task:', updatedTask); 
          const index = this.tasks.findIndex(t => t.taskId === updatedTask.taskId);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
          this.selectedTask = null;
          this.isEditMode = false;
          this.snackBar.open('Task updated successfully.', 'Close', { duration: 2000 });
          this.sortTasksByPriority(this.tasks);
          this.taskEdit.emit(updatedTask);
        },
        (error) => {
          console.error('Error updating task:', error); 
          this.snackBar.open('Error updating task. Please try again later.', 'Close', { duration: 2000 });
        }
      );
    } else {
      console.error('No task selected for update.'); 
    }
  }
  
  updateDueDate(newDueDate: Date): void {
    if (this.selectedTask) {
      this.selectedTask.dueDate = newDueDate;
      
    }
  }

  openTaskDetailsDialog(task: Task): void {
    if (!task.trashed) {
      this.dialog.open(TaskDetailsDialogComponent, {
        width: '500px',
        data: task
      });
    }
  }

  onTaskAdded(): void {
    this.loadAllTasks();
  }
  
  onTaskUpdated(updatedTask: Task): void {
    const index = this.tasks.findIndex(t => t.taskName === updatedTask.taskName);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.updateTaskCounts();
    }
  }

  openTaskStatusDialog(task: Task): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '250px';
    dialogConfig.data = task;
    dialogConfig.panelClass = 'custom-dialog-container';
  
    const dialogRef = this.dialog.open(TaskStatusDialogComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe(selectedStatus => {
      if (selectedStatus) {
        let status: TaskStatus;
  
        switch (selectedStatus) {
          case 'Completed':
            status = TaskStatus.COMPLETED;
            break;
          case 'Pending':
            status = TaskStatus.PENDING;
            break;
          case 'In progress':
            status = TaskStatus.IN_PROGRESS;
            break;
          default:
            status = TaskStatus.IN_PROGRESS;
            break;
        }
        this.updateTaskStatus(task.taskId, status);
      }
    });
  }  
  
  updateTaskStatus(taskId: string, status: TaskStatus): void {
    this.taskService.updateTaskStatus(taskId, status).subscribe(
      updatedTask => {
        this.removeFromTaskList(updatedTask, this.tasks);
        this.tasks.push(updatedTask); 
        this.updateTaskCounts(); 
        this.snackBar.open(`Task status updated to ${status}.`, 'Close', { duration: 2000 });
        if (status === TaskStatus.IN_PROGRESS) {
          this.sortTasksByPriority(this.inProgressTasks); 
        } else if (status === TaskStatus.COMPLETED) {
          this.sortTasksByPriority(this.completedTasks); 
        } else if (status === TaskStatus.PENDING) {
          this.sortTasksByPriority(this.pendingTasks); 
        }
      },
      error => {
        console.error('Error updating task status:', error);
        this.snackBar.open('Error updating task. Please try again later.', 'Close', { duration: 2000 });
      }
      );
  }

  private removeFromTaskList(task: Task, taskList: Task[]): void {
    const index = taskList.findIndex(t => t.taskId === task.taskId);
    if (index !== -1) {
      taskList.splice(index, 1);
    }
  }

  archiveTask(taskId: string): void {
    this.taskService.archiveTask(taskId).subscribe(() => {
      this.tasks = this.tasks.filter(task => task.taskId !== taskId);
      this.snackBar.open('Your task has been archived.', 'Close', { duration: 2000 });
      this.loadAllTasks(); 
    });
  }

  trashTask(taskId: string): void {
    this.taskService.trashTask(taskId).subscribe(() => {
      this.tasks = this.tasks.filter(task => task.taskId !== taskId);
      this.snackBar.open('Your task has been moved to Trash.', 'Close', { duration: 2000 });
      this.loadAllTasks(); 
    });
  }

  toggleCompletedTasksVisibility(): void {
    this.showCompletedTasks = !this.showCompletedTasks;
    this.showPendingTasks = false;
    this.showInProgressTasks = false;
  }

  togglePendingTasksVisibility(): void {
    this.showPendingTasks = !this.showPendingTasks;
    this.showCompletedTasks = false;
    this.showInProgressTasks = false;
  }

  toggleInProgressTasksVisibility(): void {
    this.showInProgressTasks = !this.showInProgressTasks;
    this.showCompletedTasks = false;
    this.showPendingTasks = false;
  }

  toggleAllTasksVisibility(): void {
    this.showAllTasks = !this.showAllTasks;
    this.showCompletedTasks = false;
    this.showPendingTasks = false;
    this.showInProgressTasks = false;
  }

  openPriorityDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskPriorityDialogComponent, {
      width: '250px',
      data: { currentPriority: task.taskPriority }
    });
  
    dialogRef.afterClosed().subscribe((selectedPriority: string) => {
      if (selectedPriority) {
        task.taskPriority = selectedPriority;
        this.taskService.updateTaskPriority(task.taskId, selectedPriority).subscribe(
          updatedTask => {
            console.log('Updated Task Priority:', updatedTask);
            const updatedPriority = updatedTask['taskPriority'];
            const index = this.tasks.findIndex(t => t.taskId === updatedTask.taskId);
            if (index !== -1) {
              this.tasks[index].taskPriority = updatedPriority;
            }
            this.snackBar.open('Task priority updated successfully.', 'Close', { duration: 2000 });
            this.sortTasksByPriority(this.tasks);
          },
          error => {
            console.error('Error updating task priority:', error);
            this.snackBar.open('Error updating task priority. Please try again later.', 'Close', { duration: 2000 });
          }
        );
      }
    });
  }
  
  private sortTasksByPriority(tasks: Task[]): void {
    const priorityOrder: { [key: string]: number } = { 'High': 3, 'Medium': 2, 'Low': 1 }; 
    console.log('Before sorting:', tasks.map(task => task.taskName + ' - ' + task.taskPriority)); 
    tasks.sort((a, b) => {
      const priorityA = priorityOrder[a.taskPriority] || 0; 
      const priorityB = priorityOrder[b.taskPriority] || 0; 
      console.log('Priority of task A:', priorityA);
      console.log('Priority of task B:', priorityB);
      const result = priorityB - priorityA;
      console.log('Comparison Result:', result);
      return result;
    });
    console.log('After sorting:', tasks.map(task => task.taskName + ' - ' + task.taskPriority)); 
    this.updateTaskLists();
  }

  private sortCompletedTasksByPriority(): void {
    const priorityOrder: { [key: string]: number } = { 'High': 3, 'Medium': 2, 'Low': 1 };
    this.completedTasks.sort((a, b) => {
      const priorityA = priorityOrder[a.taskPriority] || 0;
      const priorityB = priorityOrder[b.taskPriority] || 0;
      return priorityB - priorityA;
    });
  }
  
  private updateTaskLists(): void {
    this.completedTasks = this.tasks.filter(task => task.taskStatus === TaskStatus.COMPLETED);
    this.pendingTasks = this.tasks.filter(task => task.taskStatus === TaskStatus.PENDING);
    this.inProgressTasks = this.tasks.filter(task => task.taskStatus === TaskStatus.IN_PROGRESS);
    this.sortCompletedTasksByPriority();
  }
  
}

