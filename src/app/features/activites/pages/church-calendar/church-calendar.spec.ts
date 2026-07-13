import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchCalendar } from './church-calendar';

describe('ChurchCalendar', () => {
  let component: ChurchCalendar;
  let fixture: ComponentFixture<ChurchCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChurchCalendar],
    }).compileComponents();

    fixture = TestBed.createComponent(ChurchCalendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
