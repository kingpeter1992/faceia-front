import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CulteComponent } from './culte-component';

describe('CulteComponent', () => {
  let component: CulteComponent;
  let fixture: ComponentFixture<CulteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CulteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CulteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
