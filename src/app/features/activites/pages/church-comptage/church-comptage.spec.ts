import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchComptage } from './church-comptage';

describe('ChurchComptage', () => {
  let component: ChurchComptage;
  let fixture: ComponentFixture<ChurchComptage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChurchComptage],
    }).compileComponents();

    fixture = TestBed.createComponent(ChurchComptage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
