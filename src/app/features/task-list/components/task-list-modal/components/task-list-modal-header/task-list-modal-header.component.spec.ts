import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListModalHeaderComponent } from './task-list-modal-header.component';

describe('TaskListModalHeaderComponent', () => {
  let component: TaskListModalHeaderComponent;
  let fixture: ComponentFixture<TaskListModalHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListModalHeaderComponent],
    });
    fixture = TestBed.createComponent(TaskListModalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
