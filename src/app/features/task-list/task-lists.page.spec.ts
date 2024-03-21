import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListsPage } from './task-lists.page';

describe(TaskListsPage.name, () => {
  let component: TaskListsPage;
  let fixture: ComponentFixture<TaskListsPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListsPage],
    });
    fixture = TestBed.createComponent(TaskListsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
