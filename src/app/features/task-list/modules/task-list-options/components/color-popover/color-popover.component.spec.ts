import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPopoverComponent } from './color-popover.component';

describe('ColorPopoverComponent', () => {
  let component: ColorPopoverComponent;
  let fixture: ComponentFixture<ColorPopoverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ColorPopoverComponent],
    });
    fixture = TestBed.createComponent(ColorPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
