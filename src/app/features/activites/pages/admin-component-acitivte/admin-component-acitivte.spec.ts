import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponentAcitivte } from './admin-component-acitivte';

describe('AdminComponentAcitivte', () => {
  let component: AdminComponentAcitivte;
  let fixture: ComponentFixture<AdminComponentAcitivte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponentAcitivte],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponentAcitivte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
