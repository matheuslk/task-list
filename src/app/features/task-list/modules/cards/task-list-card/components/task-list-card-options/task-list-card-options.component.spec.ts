import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListCardOptionsComponent } from './task-list-card-options.component';

describe('TaskListCardOptionsComponent', () => {
  let component: TaskListCardOptionsComponent;
  let fixture: ComponentFixture<TaskListCardOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListCardOptionsComponent],
    });
    fixture = TestBed.createComponent(TaskListCardOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
