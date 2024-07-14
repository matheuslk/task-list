import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListCardFooterComponent } from './task-list-card-footer.component';

describe('TaskListCardFooterComponent', () => {
  let component: TaskListCardFooterComponent;
  let fixture: ComponentFixture<TaskListCardFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListCardFooterComponent],
    });
    fixture = TestBed.createComponent(TaskListCardFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
