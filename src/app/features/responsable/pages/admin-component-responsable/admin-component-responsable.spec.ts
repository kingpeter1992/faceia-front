import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponentResponsable } from './admin-component-responsable';

describe('AdminComponentResponsable', () => {
  let component: AdminComponentResponsable;
  let fixture: ComponentFixture<AdminComponentResponsable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponentResponsable],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponentResponsable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
