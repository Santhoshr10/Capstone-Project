import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { Task } from '../task';

@Component({
  selector: 'app-task-status-dialog',
  templateUrl: './task-status-dialog.component.html',
  styleUrls: ['./task-status-dialog.component.css']
})
export class TaskStatusDialogComponent {
  @ViewChild('dialogContent') dialogContent!: ElementRef; 

  constructor(
    public dialogRef: MatDialogRef<TaskStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public task: Task
  ) { }

  onStatusSelected(status: string): void {
    this.dialogRef.close(status);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}