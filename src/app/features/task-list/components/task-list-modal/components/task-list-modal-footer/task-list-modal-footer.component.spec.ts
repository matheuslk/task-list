import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListModalFooterComponent } from './task-list-modal-footer.component';

describe('TaskListModalFooterComponent', () => {
  let component: TaskListModalFooterComponent;
  let fixture: ComponentFixture<TaskListModalFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListModalFooterComponent],
    });
    fixture = TestBed.createComponent(TaskListModalFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
