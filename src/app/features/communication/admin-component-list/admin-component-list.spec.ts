import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponentList } from './admin-component-list';

describe('AdminComponentList', () => {
  let component: AdminComponentList;
  let fixture: ComponentFixture<AdminComponentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponentList],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponentList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
