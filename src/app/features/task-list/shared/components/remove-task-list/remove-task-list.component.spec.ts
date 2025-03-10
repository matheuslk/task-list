import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveTaskListComponent } from './remove-task-list.component';

describe('RemoveTaskListComponent', () => {
  let component: RemoveTaskListComponent;
  let fixture: ComponentFixture<RemoveTaskListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RemoveTaskListComponent],
    });
    fixture = TestBed.createComponent(RemoveTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
