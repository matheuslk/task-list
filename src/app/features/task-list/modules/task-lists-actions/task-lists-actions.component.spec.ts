import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListsActionsComponent } from '../../components/task-list-actions/task-lists-actions.component';

describe('TaskListsActionsComponent', () => {
  let component: TaskListsActionsComponent;
  let fixture: ComponentFixture<TaskListsActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListsActionsComponent],
    });
    fixture = TestBed.createComponent(TaskListsActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
