import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListStoreComponent } from './task-list-store.component';

describe('TaskListStoreComponent', () => {
  let component: TaskListStoreComponent;
  let fixture: ComponentFixture<TaskListStoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListStoreComponent],
    });
    fixture = TestBed.createComponent(TaskListStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
