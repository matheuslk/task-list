import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';

describe(HomePage.name, () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomePage],
    });
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
