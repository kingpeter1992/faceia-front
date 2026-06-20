import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reconait } from './reconait';

describe('Reconait', () => {
  let component: Reconait;
  let fixture: ComponentFixture<Reconait>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reconait],
    }).compileComponents();

    fixture = TestBed.createComponent(Reconait);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
