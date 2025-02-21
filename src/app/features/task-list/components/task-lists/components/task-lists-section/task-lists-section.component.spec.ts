import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListsSectionComponent } from './task-lists-section.component';

describe('TaskListsSectionComponent', () => {
  let component: TaskListsSectionComponent;
  let fixture: ComponentFixture<TaskListsSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListsSectionComponent],
    });
    fixture = TestBed.createComponent(TaskListsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
