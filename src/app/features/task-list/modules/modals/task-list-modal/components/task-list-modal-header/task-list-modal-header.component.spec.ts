import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListStoreCardHeaderComponent } from './task-list-modal-header.component';

describe('TaskListStoreCardHeaderComponent', () => {
  let component: TaskListStoreCardHeaderComponent;
  let fixture: ComponentFixture<TaskListStoreCardHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListStoreCardHeaderComponent],
    });
    fixture = TestBed.createComponent(TaskListStoreCardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
