import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListModalComponent } from '../../../modules/modals/task-list-modal/task-list-modal.component';

describe('TaskListModalComponent', () => {
  let component: TaskListModalComponent;
  let fixture: ComponentFixture<TaskListModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListModalComponent],
    });
    fixture = TestBed.createComponent(TaskListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
