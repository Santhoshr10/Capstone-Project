import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPriorityDialogComponent } from './task-priority-dialog.component';

describe('TaskPriorityDialogComponent', () => {
  let component: TaskPriorityDialogComponent;
  let fixture: ComponentFixture<TaskPriorityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskPriorityDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskPriorityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
