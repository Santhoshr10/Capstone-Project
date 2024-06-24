import { Component, OnInit } from '@angular/core';
import { Task } from '../task';
import { TaskService } from '../task.service';
import { TaskDetailsDialogComponent } from '../task-details-dialog/task-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
  archivedTasks: Task[] = [];
  searchQuery: string = '';

  constructor(private taskService: TaskService, private dialog: MatDialog , private searchService: SearchService) { }

  ngOnInit(): void {
    this.loadArchivedTasks();
    this.searchService.getSearchQuery().subscribe(query => {
      this.searchQuery = query;
      this.loadArchivedTasks();
    });
  }

  loadArchivedTasks(): void {
    this.taskService.getArchivedTasks().subscribe(
      tasks => {
        console.log('All archived tasks:', tasks);
        this.archivedTasks = tasks.filter(task =>
          task.taskName.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        console.log('Filtered archived tasks:', this.archivedTasks);
        this.sortByTaskPriority();
      },
      error => {
      console.error('Error loading archived tasks:', error);
      }
    );
  }

  sortByTaskPriority(): void {
    const priorityOrder: { [key: string]: number } = { 'High': 3, 'Medium': 2, 'Low': 1 };
    this.archivedTasks.sort((a, b) => {
      const priorityA = priorityOrder[a.taskPriority] || 0;
      const priorityB = priorityOrder[b.taskPriority] || 0;
      return priorityB - priorityA; 
    });
  }

  restoreTask(task: Task): void {
    this.taskService.unarchiveTask(task.taskId).subscribe(
      () => {
        const index = this.archivedTasks.findIndex(t => t.taskId === task.taskId);
        if (index !== -1) {
          this.archivedTasks.splice(index, 1);
        }
      },
      error => {
        console.error('Error restoring task:', error);
      }
    );
  }

  moveTaskToTrash(task: Task): void {
    this.taskService.trashTask(task.taskId).subscribe(
      () => {
        const index = this.archivedTasks.findIndex(t => t.taskId === task.taskId);
        if (index !== -1) {
          this.archivedTasks.splice(index, 1);
        }
      },
      error => {
        console.error('Error moving task to trash:', error);
      }
    );
  }

  openTaskDetailsDialog(task: Task): void {
    if(!task.trashed){
      this.dialog.open(TaskDetailsDialogComponent, {
        width: '500px',
        data: task
      });
    }
  }
}