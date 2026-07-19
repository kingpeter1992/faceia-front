import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboardqr } from './dashboardqr';

describe('Dashboardqr', () => {
  let component: Dashboardqr;
  let fixture: ComponentFixture<Dashboardqr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboardqr],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboardqr);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
