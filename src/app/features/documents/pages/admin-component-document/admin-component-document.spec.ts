import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponentDocument } from './admin-component-document';

describe('AdminComponentDocument', () => {
  let component: AdminComponentDocument;
  let fixture: ComponentFixture<AdminComponentDocument>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponentDocument],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponentDocument);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
