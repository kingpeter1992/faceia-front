import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CulteCreateComponent } from './culte-create-component';

describe('CulteCreateComponent', () => {
  let component: CulteCreateComponent;
  let fixture: ComponentFixture<CulteCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CulteCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CulteCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
