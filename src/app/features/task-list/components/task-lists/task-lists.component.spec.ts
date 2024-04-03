import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListsComponent } from './task-lists.component';

describe('TaskListsComponent', () => {
  let component: TaskListsComponent;
  let fixture: ComponentFixture<TaskListsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListsComponent],
    });
    fixture = TestBed.createComponent(TaskListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
