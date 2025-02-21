import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinTaskListComponent } from './pin-task-list.component';

describe('PinTaskListComponent', () => {
  let component: PinTaskListComponent;
  let fixture: ComponentFixture<PinTaskListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PinTaskListComponent],
    });
    fixture = TestBed.createComponent(PinTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
