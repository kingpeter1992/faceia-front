import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponentMembre } from './admin-component-membre';

describe('AdminComponentMembre', () => {
  let component: AdminComponentMembre;
  let fixture: ComponentFixture<AdminComponentMembre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponentMembre],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponentMembre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
