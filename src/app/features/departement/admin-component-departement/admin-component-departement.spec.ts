import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponentDepartement } from './admin-component-departement';

describe('AdminComponentDepartement', () => {
  let component: AdminComponentDepartement;
  let fixture: ComponentFixture<AdminComponentDepartement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponentDepartement],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponentDepartement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
