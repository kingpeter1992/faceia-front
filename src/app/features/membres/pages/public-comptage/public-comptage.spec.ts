import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicComptage } from './public-comptage';

describe('PublicComptage', () => {
  let component: PublicComptage;
  let fixture: ComponentFixture<PublicComptage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicComptage],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicComptage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
