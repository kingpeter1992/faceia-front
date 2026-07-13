import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponentCommunication } from './admin-component-communication';

describe('AdminComponentCommunication', () => {
  let component: AdminComponentCommunication;
  let fixture: ComponentFixture<AdminComponentCommunication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponentCommunication],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponentCommunication);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
