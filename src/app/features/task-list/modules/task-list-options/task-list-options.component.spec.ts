import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListOptionsComponent } from './task-list-options.component';

describe('TaskListOptionsComponent', () => {
  let component: TaskListOptionsComponent;
  let fixture: ComponentFixture<TaskListOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListOptionsComponent],
    });
    fixture = TestBed.createComponent(TaskListOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
