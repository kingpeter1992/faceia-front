import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponentFinance } from './admin-component-finance';

describe('AdminComponentFinance', () => {
  let component: AdminComponentFinance;
  let fixture: ComponentFixture<AdminComponentFinance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponentFinance],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponentFinance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
