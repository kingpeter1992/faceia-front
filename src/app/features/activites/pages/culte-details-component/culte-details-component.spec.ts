import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CulteDetailsComponent } from './culte-details-component';

describe('CulteDetailsComponent', () => {
  let component: CulteDetailsComponent;
  let fixture: ComponentFixture<CulteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CulteDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CulteDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
