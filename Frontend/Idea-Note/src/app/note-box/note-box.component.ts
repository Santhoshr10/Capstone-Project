import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../task.service';
import { Task } from '../task';
import { MatDialog } from '@angular/material/dialog';
import { TaskStatusDialogComponent } from '../task-status-dialog/task-status-dialog.component';

@Component({
  selector: 'app-note-box',
  templateUrl: './note-box.component.html',
  styleUrls: ['./note-box.component.css']
})
export class NoteBoxComponent implements OnChanges {
  isExpanded: boolean = false;
  taskName: string = '';
  dueDate: Date | null = null; 
  taskDescription: string = '';
  minDate: string = new Date().toISOString().split('T')[0];

  @Input() taskDetails: Task | null = null;
  @Input() isEditMode: boolean = false;
  @Output() taskAdded: EventEmitter<void> = new EventEmitter<void>();
  @Output() taskUpdated: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() taskEdit: EventEmitter<Task> = new EventEmitter<Task>();

  constructor(private router: Router, private taskService: TaskService, private elementRef: ElementRef, private dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskDetails'] && changes['taskDetails'].currentValue) {
      const { taskName, dueDate, taskDescription } = changes['taskDetails'].currentValue;
      this.taskName = taskName;
      this.dueDate = dueDate ? new Date(dueDate) : null;
      this.taskDescription = taskDescription;
    } else {
      this.resetTaskDetails();
    }
  }

  expandNote() {
    this.isExpanded = true;
  }

  openTaskStatusDialog() {
    const dialogRef = this.dialog.open(TaskStatusDialogComponent, {
      width: '250px',
      data: this.taskDetails
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submitNote();
      }
    });
  }

  submitNote() {
    if (!this.dueDate) {
      alert("Please enter a due date.");
      return;
    }

    const selectedDate = new Date(this.dueDate);
    selectedDate.setHours(0, 0, 0, 0);
  
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
      alert("Due date should be today's date or a future date.");
      return;
    }

    if (this.isEditMode && this.taskDetails) {
      const updatedTask = new Task(
        this.taskDetails.taskName,
        this.dueDate,
        this.taskDetails.taskPriority ?? '',
        this.taskDescription,
        this.taskDetails.isArchived,
        this.taskDetails.taskId,
        this.taskDetails.trashed,
        null
      );

      this.taskService.updateTask(updatedTask).subscribe(
        response => {
          this.taskUpdated.emit(response);
          this.isEditMode = false;
          this.isExpanded = false;
        },
        error => {
          console.error('Error updating task:', error);
        }
      );
    } else {
      const newTask = new Task(
        this.taskName,
        this.dueDate,
        '',
        this.taskDescription,
        false,
        '',
        false,
        null
      );

      this.taskService.addTask(newTask).subscribe(
        response => {
          this.taskAdded.emit();
          this.isExpanded = false;
          this.resetTaskDetails(); 
          this.taskUpdated.emit(response);
        },
        error => {
          console.error('Error adding task:', error);
        }
      );
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isExpanded = false;
      this.isEditMode = false;
    }
  }

  private resetTaskDetails(): void {
    this.taskName = '';
    this.dueDate = new Date();
    this.taskDescription = '';
    this.isExpanded = false;
  }
}
