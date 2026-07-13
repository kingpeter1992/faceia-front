import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponentEseignement } from './admin-component-eseignement';

describe('AdminComponentEseignement', () => {
  let component: AdminComponentEseignement;
  let fixture: ComponentFixture<AdminComponentEseignement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponentEseignement],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponentEseignement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
