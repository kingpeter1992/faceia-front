import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidTokenComponent } from './invalid-token-component';

describe('InvalidTokenComponent', () => {
  let component: InvalidTokenComponent;
  let fixture: ComponentFixture<InvalidTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvalidTokenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvalidTokenComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
