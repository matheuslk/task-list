import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListCardHeaderComponent } from './task-list-card-header.component';

describe('TaskListCardHeaderComponent', () => {
  let component: TaskListCardHeaderComponent;
  let fixture: ComponentFixture<TaskListCardHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListCardHeaderComponent],
    });
    fixture = TestBed.createComponent(TaskListCardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
