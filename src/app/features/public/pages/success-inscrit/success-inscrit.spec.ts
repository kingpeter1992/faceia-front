import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessInscrit } from './success-inscrit';

describe('SuccessInscrit', () => {
  let component: SuccessInscrit;
  let fixture: ComponentFixture<SuccessInscrit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessInscrit],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessInscrit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
