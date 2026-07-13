import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponentListe } from './admin-component-liste';

describe('AdminComponentListe', () => {
  let component: AdminComponentListe;
  let fixture: ComponentFixture<AdminComponentListe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponentListe],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponentListe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
