import { Component, OnInit } from '@angular/core';
import { Task } from '../task';
import { TaskService } from '../task.service';
import { TaskDetailsDialogComponent } from '../task-details-dialog/task-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from '../search.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component'; // Import the Confirmation Dialog component

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css']
})
export class TrashComponent implements OnInit {
  trashedTasks: Task[] = [];
  searchQuery: string = '';

  constructor(private taskService: TaskService, private dialog: MatDialog, private searchService: SearchService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadTrashedTasks();
    this.searchService.getSearchQuery().subscribe(query => {
      this.searchQuery = query;
      this.loadTrashedTasks();
    });
  }

  loadTrashedTasks(): void {
    this.taskService.getTrashedTasks().subscribe(
      tasks => {
        console.log('All trashed tasks:', tasks);
        this.trashedTasks = tasks.filter(task =>
          (task.taskName === null || task.taskName === undefined || task.taskName.toLowerCase().includes(this.searchQuery.toLowerCase()))
        );
        console.log('Filtered trashed tasks:', this.trashedTasks);
        this.sortByTaskPriority();
      },
      error => {
        console.error('Error loading trashed tasks:', error);
      }
    );
  }

  sortByTaskPriority(): void {
    const priorityOrder: { [key: string]: number } = { 'High': 3, 'Medium': 2, 'Low': 1 };
    this.trashedTasks.sort((a, b) => {
      const priorityA = priorityOrder[a.taskPriority] || 0;
      const priorityB = priorityOrder[b.taskPriority] || 0;
      return priorityB - priorityA; 
    });
  }
  

  deleteTask(taskId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { title: 'Confirm Deletion', message: 'Do you want to permanently delete this task?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(taskId).subscribe(
          () => {
            const index = this.trashedTasks.findIndex(t => t.taskId === taskId);
            if (index !== -1) {
              this.trashedTasks.splice(index, 1);
              this.snackBar.open('Your task has been deleted permanently.', 'Close', { duration: 2000 });
            }
          },
          error => {
            console.error('Error deleting task from trash:', error);
            this.snackBar.open('Error deleting task from trash. Please try again later.', 'Close', { duration: 2000 });
          }
        );
      }
    });
  }

  restoreTask(task: Task): void {
    this.taskService.restoreTaskFromTrash(task.taskId).subscribe(
      () => {
        const index = this.trashedTasks.findIndex(t => t.taskId === task.taskId);
        if (index !== -1) {
          this.trashedTasks.splice(index, 1);
        }
      },
      error => {
        console.error('Error restoring task from trash:', error);
      }
    );
  }

  openTaskDetailsDialog(task: Task): void {
    this.dialog.open(TaskDetailsDialogComponent, {
      width: '500px',
      data: task
    });
  }
}
