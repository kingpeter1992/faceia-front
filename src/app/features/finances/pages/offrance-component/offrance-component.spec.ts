import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffranceComponent } from './offrance-component';

describe('OffranceComponent', () => {
  let component: OffranceComponent;
  let fixture: ComponentFixture<OffranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffranceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OffranceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
