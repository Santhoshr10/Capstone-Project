import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskStatusDialogComponent } from './task-status-dialog.component';

describe('TaskStatusDialogComponent', () => {
  let component: TaskStatusDialogComponent;
  let fixture: ComponentFixture<TaskStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskStatusDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
