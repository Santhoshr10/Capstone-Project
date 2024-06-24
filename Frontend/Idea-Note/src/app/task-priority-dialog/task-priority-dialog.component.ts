import { Component, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-priority-dialog',
  templateUrl: './task-priority-dialog.component.html',
  styleUrls: ['./task-priority-dialog.component.css']
})
export class TaskPriorityDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<TaskPriorityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) { }

  
  selectPriority(priority: string): void {
    this.dialogRef.close(priority);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('backdrop')) {
      this.dialogRef.close();
    }
  }
}
